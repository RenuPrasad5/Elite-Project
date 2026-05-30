import React from 'react';
import { BaseEmailLayout } from './BaseEmailLayout';
import { Text, Button, Section } from '@react-email/components';

interface WelcomeEmailProps {
  userEmail: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ userEmail }) => {
  return (
    <BaseEmailLayout previewText="Welcome to the Elite Operator Terminal">
      <Text className="text-xl font-bold tracking-widest uppercase mb-4 text-zinc-100">
        Clearance Granted
      </Text>
      
      <Text className="text-sm text-zinc-400 mb-6 font-mono leading-relaxed">
        Operator <span className="text-gold-400 font-bold">{userEmail}</span>,
        <br /><br />
        Your terminal node is now authenticated and secured. You have successfully established a connection with the Evil Elite network.
      </Text>

      <Section className="bg-zinc-950 border border-zinc-900 rounded p-6 mb-6">
        <Text className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-2">
          Initial Protocol Instructions
        </Text>
        <Text className="text-xs text-zinc-500 font-mono mb-1">
          1. Access your Dashboard to monitor live market metrics.
        </Text>
        <Text className="text-xs text-zinc-500 font-mono mb-1">
          2. Explore the Marketplace to acquire institutional tools.
        </Text>
        <Text className="text-xs text-zinc-500 font-mono">
          3. Set your risk parameters within the Terminal Settings.
        </Text>
      </Section>

      <Section className="text-center mt-8 mb-4">
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`}
          className="bg-[#b58322] text-[#09090b] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-md"
        >
          Initialize Terminal
        </Button>
      </Section>
    </BaseEmailLayout>
  );
};

export default WelcomeEmail;
