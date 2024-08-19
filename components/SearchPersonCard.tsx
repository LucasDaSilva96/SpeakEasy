import { UserType } from '@/types/user.types';
import React from 'react';

interface SearchPersonCardProps {
  person: UserType;
}

export default function SearchPersonCard({ person }: SearchPersonCardProps) {
  return <div>SearchPersonCard</div>;
}
