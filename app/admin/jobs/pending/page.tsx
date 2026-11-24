import { redirect } from 'next/navigation';

/**
 * /admin/jobs/pending used to be a standalone copy of the "Pending Jobs"
 * review UI (duplicating PendingJobsView in app/admin/page.tsx and keeping
 * the admin key in sessionStorage). The admin panel's Pending Jobs tab is
 * the single implementation now; keep this URL working for old bookmarks.
 */
export default function PendingJobsRedirect() {
  redirect('/admin');
}
