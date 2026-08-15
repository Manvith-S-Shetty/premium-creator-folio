import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, useCallback } from 'react';
import { contactApi } from '@/lib/api/contact.api';
import { publicApi } from '@/lib/api/public.api';
import { adminApi } from '@/lib/api/admin.api';
import { ContactMessageDTO, MessageStatus } from '@/lib/types/contact.types';
import { FormInput } from '@/components/admin/ui/FormInput';
import {
  Mail,
  Search,
  Archive,
  Trash2,
  Reply,
  Eye,
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  Send,
  ShieldCheck,
} from 'lucide-react';

export const Route = createFileRoute('/admin/_admin/contact')({
  component: ContactAndInboxManager,
});

function ContactAndInboxManager() {
  // Tab state: 'inbox' vs 'settings'
  const [activeTab, setActiveTab] = useState<'inbox' | 'settings'>('inbox');

  // Inbox state
  const [messages, setMessages] = useState<ContactMessageDTO[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<MessageStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [loading, setLoading] = useState(false);

  // Selected message for detail viewing modal
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageDTO | null>(null);

  // In-CMS Reply Modal state
  const [replyModalMessage, setReplyModalMessage] = useState<ContactMessageDTO | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  // Public Settings state
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load messages from contactApi
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await contactApi.getMessages({
        status: statusFilter,
        search: searchQuery,
        page,
        pageSize,
      });
      setMessages(res.data);
      setTotalCount(res.totalCount);
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, page]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    publicApi.getPersonalInfo().then((info) => {
      if (info) {
        setEmail(info.email || '');
        setLocation(info.location || '');
      }
    });
  }, []);

  // Action: Open & automatic mark as read
  // DESIGN CHOICE RATIONALE: Marking status as 'read' automatically upon opening the message modal
  // matches standard email client workflows (Gmail, Outlook) and reduces unnecessary clicks for the admin.
  const handleOpenMessage = async (msg: ContactMessageDTO) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      try {
        await contactApi.updateMessageStatus(msg.id, 'read');
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
        );
        setSelectedMessage({ ...msg, status: 'read' });
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    }
  };

  // Action: Open reply composer modal
  const handleOpenReplyModal = (msg: ContactMessageDTO) => {
    setReplyModalMessage(msg);
    setReplySubject(`Re: ${msg.subject}`);
    setReplyText('');
    setReplyError(null);
  };

  // Action: Submit outbound reply via Resend Edge Function
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalMessage) return;

    if (!replyText.trim()) {
      setReplyError('Reply message body cannot be empty.');
      return;
    }

    setIsSendingReply(true);
    setReplyError(null);

    try {
      await contactApi.replyToMessage({
        messageId: replyModalMessage.id,
        recipientEmail: replyModalMessage.email,
        replySubject,
        replyMessage: replyText,
      });

      // Update local state
      setMessages((prev) =>
        prev.map((m) => (m.id === replyModalMessage.id ? { ...m, status: 'replied' } : m))
      );
      if (selectedMessage && selectedMessage.id === replyModalMessage.id) {
        setSelectedMessage({ ...selectedMessage, status: 'replied' });
      }

      setReplyModalMessage(null);
      fetchMessages();
    } catch (err: any) {
      console.error('Failed to send reply:', err);
      setReplyError(err.message || 'Failed to deliver reply email');
    } finally {
      setIsSendingReply(false);
    }
  };

  // Action: Mark explicit status
  const handleUpdateStatus = async (id: string, status: MessageStatus) => {
    try {
      await contactApi.updateMessageStatus(id, status);
      fetchMessages();
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Action: Delete message
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this message?')) {
      try {
        await contactApi.deleteMessage(id);
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
        fetchMessages();
      } catch (err) {
        alert('Failed to delete message');
      }
    }
  };

  // Action: Save Contact info
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminApi.upsertPersonalInfo({ email, location } as any);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save contact settings');
    } finally {
      setIsSaving(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const getStatusBadge = (status: MessageStatus) => {
    switch (status) {
      case 'unread':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Unread</span>;
      case 'read':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/20 text-slate-400 border border-slate-500/30">Read</span>;
      case 'replied':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Replied</span>;
      case 'archived':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">Archived</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Contact & Communications</h1>
          <p className="text-sm text-slate-400">View incoming portfolio messages, reply via SMTP, and manage public contact info</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-white/[0.03] p-1 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'inbox'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>CMS Inbox</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'settings'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Save className="h-4 w-4" />
            <span>Public Info Settings</span>
          </button>
        </div>
      </div>

      {activeTab === 'inbox' ? (
        <div className="space-y-6">
          {/* Active System Health Banner */}
          <div className="flex items-start gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-xs text-cyan-300">
            <ShieldCheck className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" />
            <div>
              <p className="font-semibold text-cyan-200">Active Production Contact & Inbox Pipeline</p>
              <p className="mt-0.5 text-cyan-300/90">
                Visitor submissions are protected by honeypot anti-spam, disposable domain blocking, and IP rate limiting. Direct email replies are dispatched via Supabase Edge Function & Resend SMTP.
              </p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Status Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {(['all', 'unread', 'read', 'replied', 'archived'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.08] border border-white/10'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name, email, subject..."
                className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-slate-200 outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Messages Table */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Sender</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        Loading inbox messages...
                      </td>
                    </tr>
                  ) : messages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No messages found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    messages.map((msg) => (
                      <tr
                        key={msg.id}
                        className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${
                          msg.status === 'unread' ? 'font-semibold text-slate-100 bg-cyan-500/[0.02]' : ''
                        }`}
                        onClick={() => handleOpenMessage(msg)}
                      >
                        <td className="px-4 py-3">{getStatusBadge(msg.status)}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-slate-200">{msg.name}</p>
                            <p className="text-[11px] text-slate-400 font-normal">{msg.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 max-w-xs truncate">{msg.subject}</td>
                        <td className="px-4 py-3 text-slate-400 font-normal">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenMessage(msg)}
                              title="View Details"
                              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-cyan-400"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleOpenReplyModal(msg)}
                              title="Reply via CMS"
                              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-emerald-400"
                            >
                              <Reply className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(msg.id, 'archived')}
                              title="Archive"
                              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-amber-400"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(msg.id)}
                              title="Delete"
                              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/[0.02]">
              <span className="text-xs text-slate-400">
                Showing {messages.length > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
                {Math.min(page * pageSize, totalCount)} of {totalCount} messages
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-slate-300 px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Settings Tab */
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-200">Public Contact Details</h2>
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Saved!
              </span>
            )}
          </div>

          <FormInput
            label="Primary Contact Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormInput
            label="Physical Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <div className="pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving Changes...' : 'Save Public Settings'}
            </button>
          </div>
        </form>
      )}

      {/* Message View Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100">{selectedMessage.subject}</h3>
                  {getStatusBadge(selectedMessage.status)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  From: <span className="text-cyan-400">{selectedMessage.name}</span> ({selectedMessage.email})
                </p>
                <p className="text-[11px] text-slate-500">
                  Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-white/10 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {selectedMessage.message}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const msg = selectedMessage;
                    setSelectedMessage(null);
                    handleOpenReplyModal(msg);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30"
                >
                  <Reply className="h-3.5 w-3.5" />
                  <span>Reply in CMS</span>
                </button>

                {selectedMessage.status !== 'archived' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'archived')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/30"
                  >
                    <Archive className="h-3.5 w-3.5" />
                    <span>Archive</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct In-CMS Reply Modal */}
      {replyModalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleSendReply}
            className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4 text-slate-200"
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100">Send Direct Email Reply</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  To: <span className="text-cyan-400">{replyModalMessage.name}</span> ({replyModalMessage.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplyModalMessage(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-white/10 rounded-lg"
              >
                Cancel
              </button>
            </div>

            {replyError && (
              <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-300">
                {replyError}
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Subject Line</label>
              <input
                type="text"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-slate-200 outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Reply Body Message</label>
              <textarea
                rows={6}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to the visitor..."
                required
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-slate-200 outline-none focus:border-cyan-500/50 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setReplyModalMessage(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSendingReply}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 hover:brightness-110"
              >
                <Send className="h-4 w-4" />
                {isSendingReply ? 'Sending Email...' : 'Send Reply via Resend'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
