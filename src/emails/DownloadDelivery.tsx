import React from 'react';
import { BaseEmailLayout } from './BaseEmailLayout';
import { Text, Section, Button } from '@react-email/components';

interface DownloadDeliveryEmailProps {
  productName: string;
}

export const DownloadDeliveryEmail: React.FC<DownloadDeliveryEmailProps> = ({ productName }) => {
  return (
    <BaseEmailLayout previewText="Your secure digital asset is ready">
      <Text className="text-xl font-bold tracking-widest uppercase mb-4 text-zinc-100">
        Asset Decrypted
      </Text>
      
      <Text className="text-sm text-zinc-400 mb-6 font-mono leading-relaxed">
        The cryptographic locks on <strong className="text-gold-400">{productName}</strong> have been removed. The digital asset is now accessible from your secure operator node.
      </Text>

      <Section className="bg-zinc-950 border border-zinc-900 rounded p-6 mb-6 text-center">
        <Text className="text-[10px] text-rose-500 font-mono tracking-widest uppercase mb-2">
          Security Notice
        </Text>
        <Text className="text-[11px] text-zinc-500 font-mono leading-relaxed m-0">
          Downloads are strictly linked to your hardware signature. Do not distribute these files. Unauthorized distribution will result in immediate API revocation and node termination.
        </Text>
      </Section>

      <Section className="text-center mt-8 mb-4">
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`}
          className="bg-zinc-100 text-zinc-950 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-md"
        >
          Proceed to Downloads
        </Button>
      </Section>
    </BaseEmailLayout>
  );
};

export default DownloadDeliveryEmail;
