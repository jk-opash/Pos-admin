'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNotifications, markAsRead, deleteNotification, markAllAsRead } from '@/store/slices/notificationSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, Trash2, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { Pagination } from '@/components/ui/Pagination';

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { notifications, loading } = useAppSelector((state: any) => state.notifications);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n: any) => {
      if (filterType !== 'ALL' && n.type !== filterType) return false;
      if (filterStatus === 'UNREAD' && n.isRead) return false;
      if (filterStatus === 'READ' && !n.isRead) return false;
      return true;
    });
  }, [notifications, filterType, filterStatus]);

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const currentItems = filteredNotifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };
  
  const toggleSelectAll = () => {
    if (selectedIds.size === currentItems.length && currentItems.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(currentItems.map((n: any) => n.id)));
    }
  };

  const handleBulkRead = async () => {
    for (const id of selectedIds) {
      await dispatch(markAsRead(id));
    }
    toast.success('Selected notifications marked as read');
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await dispatch(deleteNotification(id));
    }
    toast.success('Selected notifications deleted');
    setSelectedIds(new Set());
  };

  const getIconForType = (type: string) => {
    if (type === 'CRITICAL' || type === 'EMERGENCY') return <AlertTriangle className="h-4 w-4 text-rose-500" />;
    if (type === 'SUCCESS') return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    return <Info className="h-4 w-4 text-indigo-500" />;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notification Center</h1>
          <p className="text-slate-500 text-sm mt-1">Manage global system alerts and updates.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => dispatch(markAllAsRead())}>
            Mark All as Read
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex gap-4 items-center">
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 mr-4">
                <span className="text-sm font-medium text-slate-600">{selectedIds.size} selected</span>
                <Button size="sm" variant="secondary" onClick={handleBulkRead}>
                  <Check className="h-4 w-4 mr-1" /> Read
                </Button>
                <Button size="sm" variant="danger" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            )}
            <select 
              className="text-sm border border-slate-200 rounded-md px-3 py-1.5"
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">All Status</option>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
            </select>
            <select 
              className="text-sm border border-slate-200 rounded-md px-3 py-1.5"
              value={filterType}
              onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">All Types</option>
              <option value="INFO">Info</option>
              <option value="CRITICAL">Critical</option>
              <option value="SUCCESS">Success</option>
            </select>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">
                <input 
                  type="checkbox" 
                  checked={selectedIds.size === currentItems.length && currentItems.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                />
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Notification</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">Loading notifications...</TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">No notifications found.</TableCell>
              </TableRow>
            ) : (
              currentItems.map((notif: any) => (
                <TableRow key={notif.id} className={notif.isRead ? 'opacity-70 bg-white' : 'bg-indigo-50/20'}>
                  <TableCell className="text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(notif.id)}
                      onChange={() => toggleSelect(notif.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getIconForType(notif.type)}
                      <span className="text-xs font-semibold text-slate-600">{notif.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className={`text-sm ${notif.isRead ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>
                        {notif.title}
                        {!notif.isRead && <Badge variant="blue" className="ml-2 text-[9px] py-0">New</Badge>}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1">{notif.message}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {new Date(notif.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!notif.isRead && (
                        <Button size="sm" variant="ghost" onClick={() => dispatch(markAsRead(notif.id))} title="Mark as read">
                          <Check className="h-4 w-4 text-indigo-600" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => dispatch(deleteNotification(notif.id))} title="Delete">
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex justify-center">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
