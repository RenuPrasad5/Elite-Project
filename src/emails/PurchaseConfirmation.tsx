import React from 'react';
import { BaseEmailLayout } from './BaseEmailLayout';
import { Text, Section, Button } from '@react-email/components';

interface PurchaseConfirmationEmailProps {
  productName: string;
  amount: string;
}

export const PurchaseConfirmationEmail: React.FC<PurchaseConfirmationEmailProps> = ({ productName, amount }) => {
  return (
    <BaseEmailLayout previewText={`Receipt: ${productName} Unlocked`}>
      <Text className="text-xl font-bold tracking-widest uppercase mb-4 text-emerald-400">
        Asset Secured
      </Text>
      
      <Text className="text-sm text-zinc-400 mb-6 font-mono leading-relaxed">
        Your cryptographic payment for <strong className="text-zinc-200">{productName}</strong> has been successfully verified by the ledger. The asset is now unlocked in your secure repository.
      </Text>

      <Section className="bg-zinc-950 border border-zinc-900 rounded p-6 mb-6">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-2">
          <Text className="text-xs font-bold uppercase tracking-widest text-zinc-500 m-0">Invoice Ledger</Text>
          <Text className="text-xs font-bold text-emerald-500 font-mono m-0">PAID</Text>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Text className="text-xs text-zinc-300 font-mono m-0">{productName}</Text>
          <Text className="text-sm font-bold text-gold-400 font-mono m-0">${amount}</Text>
        </div>
      </Section>

      <Section className="text-center mt-8 mb-4">
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`}
          className="bg-[#b58322] text-[#09090b] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-md"
        >
          Access Repository
        </Button>
      </Section>
    </BaseEmailLayout>
  );
};

export default PurchaseConfirmationEmail;
