import React from 'react';
import { BaseEmailLayout } from './BaseEmailLayout';
import { Text, Section, Button } from '@react-email/components';

interface SubscriptionRenewalEmailProps {
  tierName: string;
  nextBillingDate: string;
}

export const SubscriptionRenewalEmail: React.FC<SubscriptionRenewalEmailProps> = ({ tierName, nextBillingDate }) => {
  return (
    <BaseEmailLayout previewText={`Clearance Tier: ${tierName} Maintained`}>
      <Text className="text-xl font-bold tracking-widest uppercase mb-4 text-gold-400">
        Clearance Maintained
      </Text>
      
      <Text className="text-sm text-zinc-400 mb-6 font-mono leading-relaxed">
        Your <strong className="text-zinc-200">{tierName}</strong> subscription has been successfully renewed. Your institutional clearance level remains active and uninterrupted.
      </Text>

      <Section className="bg-zinc-950 border border-zinc-900 rounded p-6 mb-6">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-2">
          <Text className="text-xs font-bold uppercase tracking-widest text-zinc-500 m-0">Clearance Tier</Text>
          <Text className="text-xs font-bold text-gold-400 uppercase tracking-widest m-0">{tierName}</Text>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Text className="text-xs text-zinc-500 uppercase tracking-widest m-0">Next Cycle</Text>
          <Text className="text-xs font-bold text-zinc-300 font-mono m-0">{nextBillingDate}</Text>
        </div>
      </Section>

      <Section className="text-center mt-8 mb-4">
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`}
          className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-md"
        >
          Return to Terminal
        </Button>
      </Section>
    </BaseEmailLayout>
  );
};

export default SubscriptionRenewalEmail;
