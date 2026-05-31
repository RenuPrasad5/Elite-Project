import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Img,
  Tailwind,
  Hr,
} from '@react-email/components';

interface BaseEmailLayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

export const BaseEmailLayout: React.FC<BaseEmailLayoutProps> = ({ children, previewText }) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                gold: {
                  400: '#cc9b33',
                  500: '#b58322',
                  950: '#2c190a',
                },
                zinc: {
                  100: '#f4f4f5',
                  400: '#a1a1aa',
                  500: '#71717a',
                  800: '#27272a',
                  900: '#18181b',
                  950: '#09090b',
                },
              },
            },
          },
        }}
      >
        <Body className="bg-[#020202] text-zinc-100 font-sans mx-auto">
          <Container className="bg-[#050505] border border-zinc-900 rounded-lg mx-auto p-8 my-10 max-w-[600px] overflow-hidden">
            {/* Header / Logo */}
            <Section className="mb-8 text-center">
              <Img src="/logo.png" alt="EvilElite Trading Logo" className="h-16 w-auto mx-auto object-contain mb-4" />
              <Text className="text-center font-bold tracking-[0.15em] text-xl m-0 text-zinc-100">
                EVIL ELITE
              </Text>
            </Section>

            <Hr className="border-zinc-900 my-6" />

            {/* Main Content Area */}
            <Section>{children}</Section>

            <Hr className="border-zinc-900 my-6" />

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-zinc-500 text-xs tracking-widest uppercase mb-2">
                Secure Terminal Communication
              </Text>
              <Text className="text-zinc-600 text-[10px]">
                © {new Date().getFullYear()} Evil Elite Institutional. All rights reserved.<br />
                This message was intended for authorized operators only.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default BaseEmailLayout;
