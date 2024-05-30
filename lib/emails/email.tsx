import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Hr,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';
import { siteConfig } from '../config/site';

interface WelcomeEmailProps {
  title: string;
  description: string;
  links?: {
    privacy?: string;
    terms?: string;
  };
  redirect?: {
    url?: string;
    title?: string;
  };
  verificationCode?: string;
}

export function Email({
  title,
  description,
  links,
  verificationCode,
  redirect,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome</Preview>
      <Tailwind>
        <Body className='bg-offwhite text-base font-sans'>
          <Container className='p-5 mx-auto my-0 bg-[#eee]'>
            <Section className='bg-white text-[#212121]'>
              <Section className='bg-[#252f3d] flex py-5 px-0 items-center justify-center'>
                <Img
                  src={`${redirect?.url}/static/aws-logo.png`}
                  width='75'
                  height='45'
                  alt="AWS's Logo"
                />
              </Section>
              <Section className='py-6 px-9'>
                <Text className='text-[#333] text-xl font-bold mb-4'>
                  {title}
                </Text>
                <Text className='mb-3 text-[#333] text-sm py-3 mx-0'>
                  {description}
                </Text>
                {redirect?.url && (
                  <Section className='py-5 px-9 flex items-center justify-center'>
                    <Text className='block w-full m-0 font-bold text-center  text-[#333] '>
                      Click the button to verify
                    </Text>

                    <Button
                      className='box-border bg-[#333] w-full rounded text-white text-xs font-semibold text-center mt-2 px-5 py-3'
                      href={redirect.url}
                    >
                      {redirect.title}
                    </Button>
                    <Text className='w-full m-0 text-center  text-[#333] text-sm'>
                      (This link is valid for 10 minutes)
                    </Text>
                  </Section>
                )}
                {verificationCode && (
                  <Section className='py-5 px-9 flex items-center justify-center'>
                    <Text className='m-0 font-bold text-center  text-[#333] '>
                      Verification code
                    </Text>

                    <Text className='font-semibold text-4xl my-3 mx-0 text-center'>
                      {verificationCode}
                    </Text>
                    <Text className='m-0 text-center  text-[#333] text-sm my-3 mx-0'>
                      (This code is valid for 10 minutes)
                    </Text>
                  </Section>
                )}
              </Section>
              <Hr />
              <Section className='py-6 px-9'>
                <Text className='m-0 text-[#333] text-sm my-3 mx-0'>
                  {siteConfig.name} will never email you and ask you to disclose
                  or verify your password, credit card, or banking account
                  number.
                </Text>
              </Section>
            </Section>
            <Text className=' text-[#333] text-xs py-0 px-5 my-3 mx-0 '>
              This message was produced and distributed by {siteConfig.name},
              Inc.,410 kigali Ave. North, Seattle, WA 98109. © 2024,{' '}
              {siteConfig.name}, Inc.. All rights reserved. of{' '}
              <Link
                className='text-[#2754c5] text-sm underline'
                href='https://amazon.com'
                target='_blank'
              >
                {links?.terms}
              </Link>
              , Inc. View our{' '}
              <Link
                className='text-[#2754c5] text-sm underline'
                href='https://amazon.com'
                target='_blank'
              >
                {links?.privacy}
              </Link>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default Email;
