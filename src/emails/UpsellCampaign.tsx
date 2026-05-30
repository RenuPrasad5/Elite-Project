import React from 'react';
import { BaseEmailLayout } from './BaseEmailLayout';
import { Text, Section, Button } from '@react-email/components';

export const UpsellCampaignEmail: React.FC = () => {
  return (
    <BaseEmailLayout previewText="Upgrade your Clearance Level">
      <Text className="text-xl font-bold tracking-widest uppercase mb-4 text-gold-400">
        Elevate Your Edge
      </Text>
      
      <Text className="text-sm text-zinc-400 mb-6 font-mono leading-relaxed">
        Your current operator metrics show exceptional performance. It's time to stop trading with retail tools and upgrade your authorization to <strong className="text-zinc-100">ELITE Tier</strong>.
      </Text>

      <Section className="bg-gradient-to-br from-gold-950/20 to-transparent border border-gold-500/20 rounded p-6 mb-6">
        <Text className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-3">
          Elite Tier Advantages
        </Text>
        <Text className="text-xs text-zinc-300 font-mono mb-1.5 flex items-center">
          <span className="text-gold-500 mr-2">»</span> Full 100x Isolated Margins
        </Text>
        <Text className="text-xs text-zinc-300 font-mono mb-1.5 flex items-center">
          <span className="text-gold-500 mr-2">»</span> HFT Python Bot Repositories
        </Text>
        <Text className="text-xs text-zinc-300 font-mono flex items-center">
          <span className="text-gold-500 mr-2">»</span> Automated Webhook Integrations
        </Text>
      </Section>

      <Section className="text-center mt-8 mb-4">
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`}
          className="bg-gradient-to-r from-gold-600 to-gold-500 text-[#09090b] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-md"
        >
          Request Elite Clearance
        </Button>
      </Section>
    </BaseEmailLayout>
  );
};

export default UpsellCampaignEmail;
