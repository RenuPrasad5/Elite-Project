import React from 'react';
import { BaseEmailLayout } from './BaseEmailLayout';
import { Text, Section, Button } from '@react-email/components';

interface AbandonedCheckoutEmailProps {
  productName?: string;
  checkoutUrl: string;
}

export const AbandonedCheckoutEmail: React.FC<AbandonedCheckoutEmailProps> = ({ productName = 'pending assets', checkoutUrl }) => {
  return (
    <BaseEmailLayout previewText="Your secure session is expiring soon">
      <Text className="text-xl font-bold tracking-widest uppercase mb-4 text-rose-500">
        Session Expiring
      </Text>
      
      <Text className="text-sm text-zinc-400 mb-6 font-mono leading-relaxed">
        We detected an incomplete authorization sequence for <strong className="text-zinc-200">{productName}</strong>. Your secure checkout session will expire shortly, permanently purging the reserved allocation.
      </Text>

      <Section className="bg-zinc-950 border border-zinc-900 rounded p-6 mb-6 text-center">
        <Text className="text-[11px] text-zinc-500 font-mono leading-relaxed m-0">
          Institutional markets wait for no one. Secure your clearance level before the allocation is transferred to another operator.
        </Text>
      </Section>

      <Section className="text-center mt-8 mb-4">
        <Button
          href={checkoutUrl}
          className="bg-rose-900 text-rose-100 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-md"
        >
          Resume Authorization
        </Button>
      </Section>
    </BaseEmailLayout>
  );
};

export default AbandonedCheckoutEmail;
