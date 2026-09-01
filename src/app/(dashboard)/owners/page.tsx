'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdmins } from '@/store/slices/adminSlice';

import { Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OwnerTable } from './_components/OwnerTable';
import { Input } from '@/components/ui/Input';
import { LottieLoader } from "@/components/ui/LottieLoader";

export default function OwnersPage() {
  const dispatch = useAppDispatch();
  const { admins, isLoading } = useAppSelector((state) => state.admin);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
          <Users className="h-6 w-6 text-brand-primary" />
          Business Owners
        </h2>
        <p className="mt-1 text-sm text-brand-muted">
          Manage all registered business owners and their platform access.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Input 
            placeholder="Search owners by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LottieLoader size="lg" text="Loading owners..." />
        </div>
      ) : (
        <OwnerTable data={filteredAdmins} />
      )}
    </div>
  );
}
