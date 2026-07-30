import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export const Route = createFileRoute('/admin/_admin')({
  component: () => (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  ),
});
