'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, AlertCircle, Paperclip, Send, ShieldAlert, CheckCircle2, MoreVertical, Search, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { mockSupportTickets } from '@/lib/mock/support-tickets';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import { SupportTicket } from '@/types';

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const ticket = mockSupportTickets.find(t => t.id === resolvedParams.id);
  
  const [replyText, setReplyText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [activeTab, setActiveTab] = useState<'conversation' | 'internal_notes'>('conversation');

  if (!ticket) return notFound();

  return (
    <div className="space-y-6 pb-12 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <Link href="/support" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-dark mb-2 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Support Desk
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-brand-dark">{ticket.subject}</h1>
            <Badge variant="muted" className="font-mono bg-white">{ticket.ticketNumber}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {ticket.status !== 'closed' && ticket.status !== 'resolved' && (
            <Button variant="secondary" className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              <CheckCircle2 className="h-4 w-4" /> Mark Resolved
            </Button>
          )}
          <Button variant="secondary" className="px-2">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Main Content (Chat / Notes) */}
        <div className="lg:col-span-2 flex-1 flex flex-col rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden min-h-0">
          
          <div className="border-b border-brand-border bg-brand-light px-6 py-3 flex gap-6 shrink-0">
            <button 
              className={`font-semibold text-sm pb-2 border-b-2 transition-colors ${activeTab === 'conversation' ? 'border-brand-primary text-brand-dark' : 'border-transparent text-brand-muted hover:text-brand-dark'}`}
              onClick={() => setActiveTab('conversation')}
            >
              Customer Conversation
            </button>
            <button 
              className={`font-semibold text-sm pb-2 border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'internal_notes' ? 'border-amber-500 text-amber-900' : 'border-transparent text-brand-muted hover:text-brand-dark'}`}
              onClick={() => setActiveTab('internal_notes')}
            >
              <Lock className="h-3 w-3" /> Internal Notes
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-brand-light flex flex-col gap-6">
            
            {/* Initial Ticket Description */}
            <div className="flex flex-col gap-1 max-w-3xl">
              <div className="flex items-center gap-2 text-xs text-brand-muted mb-1">
                <span className="font-semibold text-brand-dark">{ticket.contactPerson}</span>
                <span>•</span>
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
              <div className="bg-white border border-brand-border rounded-2xl rounded-tl-sm p-4 shadow-sm text-sm text-brand-dark leading-relaxed">
                {ticket.description}
              </div>
            </div>

            {/* Render Timeline based on active tab */}
            {activeTab === 'conversation' ? (
              <>
                {ticket.messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col gap-1 max-w-3xl ${msg.senderRole !== 'customer' ? 'self-end items-end' : ''}`}>
                    <div className="flex items-center gap-2 text-xs text-brand-muted mb-1">
                      <span className="font-semibold text-brand-dark">{msg.senderName}</span>
                      {msg.senderRole === 'support_agent' && <Badge variant="purple" className="text-[10px] px-1 py-0 h-4">Staff</Badge>}
                      {msg.senderRole === 'system' && <Badge variant="muted" className="text-[10px] px-1 py-0 h-4">System</Badge>}
                      <span>•</span>
                      <span>{formatRelativeTime(msg.createdAt)}</span>
                    </div>
                    
                    {msg.senderRole === 'system' ? (
                      <div className="bg-slate-100 border border-slate-200 text-slate-600 italic rounded-lg p-3 text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> {msg.content}
                      </div>
                    ) : (
                      <div className={`${
                        msg.senderRole === 'customer' 
                          ? 'bg-white border border-brand-border rounded-2xl rounded-tl-sm' 
                          : 'bg-brand-primaryLight border border-indigo-200 text-brand-dark rounded-2xl rounded-tr-sm'
                      } p-4 shadow-sm text-sm leading-relaxed`}>
                        {msg.content}
                        
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-brand-border flex gap-2">
                            {msg.attachments.map((att, i) => (
                              <span key={i} className="inline-flex items-center gap-1 text-xs text-brand-primary bg-white px-2 py-1 rounded border border-brand-border">
                                <Paperclip className="h-3 w-3" /> {att}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              // Internal Notes view
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex items-start gap-2 max-w-3xl">
                  <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                  <p>Internal notes are strictly private. The customer <strong>cannot</strong> see anything written in this tab.</p>
                </div>
                
                {ticket.internalNotes.map(note => (
                  <div key={note.id} className="flex flex-col gap-1 max-w-3xl">
                    <div className="flex items-center gap-2 text-xs text-brand-muted mb-1">
                      <span className="font-semibold text-amber-900">{note.authorName}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(note.createdAt)}</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm text-sm text-amber-900 leading-relaxed">
                      {note.content}
                    </div>
                  </div>
                ))}
                
                {ticket.internalNotes.length === 0 && (
                  <p className="text-sm text-brand-placeholder text-center my-8">No internal notes yet.</p>
                )}
              </>
            )}

          </div>

          {/* Reply Area */}
          <div className="p-4 bg-white border-t border-brand-border shrink-0">
            {activeTab === 'conversation' ? (
              <div className="relative">
                <textarea
                  className="w-full rounded-xl border border-brand-border pl-4 pr-24 py-3 text-sm text-brand-dark focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary min-h-[80px] resize-none"
                  placeholder="Type a reply to the customer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-2">
                  <button className="p-2 text-brand-placeholder hover:text-brand-dark transition-colors rounded-lg hover:bg-slate-100">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <Button size="sm" className="bg-brand-primary hover:bg-brand-primaryDark text-white rounded-lg px-3 gap-1 h-8">
                    <Send className="h-3 w-3" /> Send
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <textarea
                  className="w-full rounded-xl border border-amber-300 bg-amber-50 pl-4 pr-24 py-3 text-sm text-amber-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-[80px] resize-none placeholder:text-amber-700/50"
                  placeholder="Write a private internal note..."
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                />
                <div className="absolute right-2 bottom-2">
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-3 gap-1 h-8">
                    <Lock className="h-3 w-3" /> Save Note
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Properties */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6 overflow-y-auto min-h-0">
          
          <div className="rounded-2xl border border-brand-border bg-white shadow-sm p-5 space-y-5">
            <h3 className="font-bold text-brand-dark border-b border-brand-border pb-2">Ticket Properties</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-1.5 block">Status</label>
                <Select
                  value={ticket.status}
                  options={[
                    { label: 'Open', value: 'open' },
                    { label: 'In Progress', value: 'in_progress' },
                    { label: 'Escalated', value: 'escalated' },
                    { label: 'Waiting for Customer', value: 'waiting_for_customer' },
                    { label: 'Resolved', value: 'resolved' },
                    { label: 'Closed', value: 'closed' },
                  ]}
                />
              </div>
              
              <div>
                <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-1.5 block">Priority</label>
                <Select
                  value={ticket.priority}
                  options={[
                    { label: 'Low', value: 'low' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'High', value: 'high' },
                    { label: 'Critical', value: 'critical' },
                    { label: 'Emergency', value: 'emergency' },
                  ]}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-1.5 block">Assignee</label>
                <Select
                  value={ticket.assignedTo || 'unassigned'}
                  options={[
                    { label: 'Unassigned', value: 'unassigned' },
                    { label: 'David Chen', value: 'David Chen' },
                    { label: 'Sarah Jenkins', value: 'Sarah Jenkins' },
                    { label: 'Priya Sharma', value: 'Priya Sharma' },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-border bg-white shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-brand-dark border-b border-brand-border pb-2">Customer Details</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-xs text-brand-placeholder block">Business</span>
                <Link href={`/businesses/${ticket.businessId}`} className="text-sm font-semibold text-brand-primary hover:underline">
                  {ticket.businessName}
                </Link>
                {ticket.branchName && (
                  <span className="text-xs text-brand-muted block mt-0.5">{ticket.branchName}</span>
                )}
              </div>
              
              <div>
                <span className="text-xs text-brand-placeholder block">Contact Person</span>
                <span className="text-sm font-medium text-brand-dark block">{ticket.contactPerson}</span>
                <a href={`mailto:${ticket.contactEmail}`} className="text-xs text-brand-muted hover:text-brand-primary">{ticket.contactEmail}</a>
              </div>
            </div>
          </div>

          {ticket.slaDeadline && (
            <div className={`rounded-2xl border p-5 shadow-sm ${ticket.slaBreached ? 'bg-red-50 border-red-200' : 'bg-brand-light border-brand-border'}`}>
              <h3 className={`font-bold text-sm flex items-center gap-2 mb-1 ${ticket.slaBreached ? 'text-red-700' : 'text-brand-dark'}`}>
                <Clock className="h-4 w-4" /> SLA Status
              </h3>
              {ticket.slaBreached ? (
                <p className="text-xs text-red-600 font-semibold">Resolution time breached by 1hr 15m</p>
              ) : (
                <p className="text-xs text-brand-muted">Due {formatRelativeTime(ticket.slaDeadline)}</p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
