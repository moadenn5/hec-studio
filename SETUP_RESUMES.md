# Activer la section « Résumés » (Supabase) — guide pas à pas

Tant que `config.js` reste en `mode: "off"`, la section est **invisible** dans l'application. Ce guide l'active.
Tout est gratuit (aucune carte de crédit). Durée : environ 20 minutes.

## Comment ça marche
- Les personnes se connectent avec leur adresse **@hec.ca** : un **code à 6 chiffres** leur est envoyé par courriel (pas de mot de passe).
- Seuls les comptes @hec.ca peuvent **lire, télécharger et déposer** (règles de sécurité côté serveur, pas seulement dans l'interface).
- Les fichiers sont dans un stockage **privé** ; chaque téléchargement utilise un lien signé valable 2 minutes.
- Chacun peut supprimer ses propres résumés ; vous (modérateur) pouvez tout supprimer. Un bouton « Signaler » alerte la modération.

## 1. Créer le projet Supabase
1. Créez un compte sur https://supabase.com (vous le faites vous-même), puis **New project** (région : Canada/East US, mot de passe de base de données à conserver).
2. Dans **Project Settings → API**, notez l'**URL du projet** et la clé **anon / public** (elle est publique par conception).

## 2. Créer les tables et les règles de sécurité
Dans **SQL Editor → New query**, collez et exécutez ceci (remplacez l'adresse du modérateur à la fin) :

```sql
-- Aides
create table public.app_admins (email text primary key);
alter table public.app_admins enable row level security;

create function public.is_hec() returns boolean
language sql stable as $$
  select coalesce(lower(auth.jwt()->>'email') ~ '^[^@]+@hec\.ca$', false)
$$;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.app_admins
                 where lower(email) = lower(auth.jwt()->>'email'))
$$;

create policy "admin voit sa ligne" on public.app_admins
  for select to authenticated using (lower(email) = lower(auth.jwt()->>'email'));

-- Résumés
create table public.summaries (
  id uuid primary key default gen_random_uuid(),
  course_code  text not null check (course_code ~ '^[A-Z]{3,4} [0-9]{5}$'),
  chapter      text not null check (char_length(chapter) between 1 and 80),
  title        text not null check (char_length(title)   between 1 and 120),
  note         text check (char_length(note) <= 500),
  file_path    text not null unique,
  file_name    text not null check (char_length(file_name) <= 200),
  file_size    bigint not null check (file_size between 1 and 15728640),
  mime_type    text,
  author_id    uuid not null default auth.uid(),
  author_label text not null default 'Étudiant HEC' check (char_length(author_label) <= 60),
  created_at   timestamptz not null default now()
);
alter table public.summaries enable row level security;

create policy "lecture @hec.ca" on public.summaries
  for select to authenticated using (public.is_hec());
create policy "dépôt @hec.ca" on public.summaries
  for insert to authenticated
  with check (public.is_hec() and author_id = auth.uid() and file_path like auth.uid()::text || '/%');
create policy "suppression auteur ou modérateur" on public.summaries
  for delete to authenticated using (author_id = auth.uid() or public.is_admin());

-- Signalements
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  summary_id  uuid not null references public.summaries(id) on delete cascade,
  reporter_id uuid not null default auth.uid(),
  reason      text not null check (char_length(reason) <= 300),
  created_at  timestamptz not null default now(),
  unique (summary_id, reporter_id)
);
alter table public.reports enable row level security;
create policy "signaler @hec.ca" on public.reports
  for insert to authenticated with check (public.is_hec() and reporter_id = auth.uid());
create policy "modérateur lit les signalements" on public.reports
  for select to authenticated using (public.is_admin());
create policy "modérateur supprime les signalements" on public.reports
  for delete to authenticated using (public.is_admin());

-- Stockage privé (15 Mo, documents seulement)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('summaries', 'summaries', false, 15728640, array[
  'application/pdf','application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);

create policy "fichiers : lecture @hec.ca" on storage.objects
  for select to authenticated using (bucket_id = 'summaries' and public.is_hec());
create policy "fichiers : dépôt dans son dossier" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'summaries' and public.is_hec() and (storage.foldername(name))[1] = auth.uid()::text);
create policy "fichiers : suppression auteur ou modérateur" on storage.objects
  for delete to authenticated
  using (bucket_id = 'summaries' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- Refuse toute inscription hors @hec.ca (évite aussi l'envoi de courriels à n'importe qui)
create function public.hook_only_hec(event jsonb) returns jsonb
language plpgsql as $$
begin
  if lower(event->'user'->>'email') !~ '^[^@]+@hec\.ca$' then
    return jsonb_build_object('error', jsonb_build_object(
      'message', 'Seules les adresses @hec.ca sont acceptées.', 'http_code', 403));
  end if;
  return '{}'::jsonb;
end $$;
grant execute on function public.hook_only_hec to supabase_auth_admin;
revoke execute on function public.hook_only_hec from authenticated, anon, public;

-- Droits d'accès pour l'API (nécessaires si « Automatically expose new tables » est désactivé ; sans danger sinon)
grant usage on schema public to authenticated;
grant select on public.app_admins to authenticated;
grant select, insert, delete on public.summaries to authenticated;
grant select, insert, delete on public.reports to authenticated;

-- Vous, modérateur (REMPLACEZ par votre adresse @hec.ca, la même que pour vous connecter)
insert into public.app_admins (email) values ('prenom.nom@hec.ca');
```

## 3. Connexion par code (courriel)
1. **Authentication → Hooks → Before User Created** : choisissez la fonction `hook_only_hec`.
2. **Authentication → Sign In / Providers → Email** : activé. (« Confirm email » n'a pas d'effet pour les codes.)
3. **Authentication → Email Templates** : dans **Magic Link** *et* **Confirm signup**, remplacez le contenu par un message contenant le code, par exemple :
   `<p>Votre code de connexion HEC-M Planificateur : <strong>{{ .Token }}</strong></p><p>Il expire dans 1 heure.</p>`
4. **Authentication → URL Configuration → Site URL** : `https://moadenn5.github.io/hec-studio/`
5. **Authentication → SMTP Settings** (obligatoire : le service d'essai de Supabase n'envoie qu'à quelques adresses de l'équipe du projet) : activez le SMTP personnalisé avec un service gratuit, par exemple **Brevo** (300 courriels/jour) : créez un compte, vérifiez un expéditeur, puis copiez l'hôte `smtp-relay.brevo.com`, le port `587`, l'identifiant et la clé SMTP dans Supabase.
   Astuce : testez l'envoi vers une vraie adresse @hec.ca et regardez les courriels indésirables ; HEC peut filtrer un expéditeur inconnu.
6. **Authentication → Rate Limits** : laissez les valeurs par défaut (protège contre l'abus).

## 4. Brancher l'application
Éditez `config.js` (à la racine du dépôt GitHub) :

```js
window.HEC_SUMMARIES = {
    mode: "supabase",
    supabaseUrl: "https://VOTRE-PROJET.supabase.co",
    supabaseAnonKey: "VOTRE_CLE_ANON"
};
```
Publiez le fichier (GitHub Pages) : l'onglet **Résumés** apparaît. Ne mettez **jamais** la clé `service_role` dans ce fichier.

## 5. Modération
- **Voir les signalements** : Table Editor → `reports`.
- **Supprimer un résumé** : connecté avec votre adresse modérateur, le bouton « Supprimer » apparaît sur tous les résumés.
- Un document problématique (examen, matériel du professeur, droit d'auteur) doit être retiré rapidement.

## Limites du forfait gratuit
Environ 1 Go de fichiers et 50 000 utilisateurs actifs/mois. Un projet gratuit **se met en pause après 7 jours sans activité** (réactivation en un clic dans le tableau de bord).

## Tester sans serveur
Ajoutez `?resumes=demo` à l'adresse de l'application : mode démonstration (rien n'est enregistré ; code de connexion `123456`).
