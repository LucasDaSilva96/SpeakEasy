'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import React, { useEffect } from 'react';
import { signUpValidation } from '@/lib/validation/singUp.validation';
import { LanguageType } from '@/types/language.types';
import { getAllLanguages } from '@/lib/actions/language.actions';
import { Loader2 } from 'lucide-react';
import { createUser } from '@/lib/actions/user.actions';
import { UserCreateType, UserType } from '@/types/user.types';
import { parseResponse } from '@/lib/response';
import toast from 'react-hot-toast';

interface SignUpFormProps {
  setState: (state: string) => void;
}

export default function SignUpForm({ setState }: SignUpFormProps) {
  const [languages, setLanguages] = React.useState<LanguageType[]>([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    getAllLanguages().then((res) => {
      setLanguages(JSON.parse(res as any));
    });
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      passwordConfirm: '',
      nativeLanguage: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpValidation>) {
    // ✅ This will be type-safe and validated.
    setLoading(true);
    try {
      await createUser(values as UserCreateType);
      // TODO: Every new user should  receive a welcome email.
      const formData = new FormData();
      formData.append('name', values.firstName + ' ' + values.lastName);
      formData.append('access_key', process.env.NEXT_PUBLIC_WEB3_FORM_KEY!);
      formData.append('subject', 'SpeakEasy - Welcome to the Community');
      formData.append('from_name', 'SpeakEasy');
      formData.append(
        'message',
        "🎉Welcome to SpeakEasy!🎉 We're excited to have you join our community. If you have any questions, feel free to reach out to us."
      );
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: json,
      });

      if (!response.ok) {
        throw new Error(
          'Something went wrong. Please try again or contact support'
        );
      }

      toast.success('User created successfully');
      setState('login');
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to create user. Please try again');
    } finally {
      setLoading(false);
    }
  }
  return (
    <motion.div
      className='relative'
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      exit={{ opacity: 0, scale: 0.6 }}
    >
      <div className='flex-center-col pb-4'>
        <h3 className='text-center py-2 font-semibold text-white text-lg'>
          Welcome
        </h3>
        <p className='text-white text-sm font-thin'>
          Join the Conversation, No Matter the Language
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex-center-col gap-6'
        >
          <div className='w-full flex items-start gap-2'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem className='flex flex-col text-white w-full'>
                  <FormLabel className='text-xs'>First Name*</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      autoComplete='given-name'
                      className='bg-black/75 transition-colors ease-in  focus:bg-black border-none'
                      placeholder='John'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='hidden'>
                    Sign up with your first name
                  </FormDescription>
                  <FormMessage className='text-rose-600' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem className='flex flex-col text-white w-full'>
                  <FormLabel className='text-xs'>Last Name*</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      autoComplete='family-name'
                      className='bg-black/75 transition-colors ease-in  focus:bg-black border-none'
                      placeholder='Doe'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='hidden'>
                    Sign up with your last name
                  </FormDescription>
                  <FormMessage className='text-rose-600' />
                </FormItem>
              )}
            />
          </div>
          {/*  */}
          <div className='flex flex-col gap-4 sm:gap-2 sm:flex-row w-full items-start'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='flex flex-col text-white w-full'>
                  <FormLabel className='text-xs'>Email*</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      autoComplete='email'
                      className='bg-black/75 transition-colors ease-in  focus:bg-black border-none'
                      placeholder='example@io.com'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='hidden'>
                    Sign up with your email
                  </FormDescription>
                  <FormMessage className='text-rose-600' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='nativeLanguage'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-0.5 text-white w-full'>
                  <FormLabel>Native Language*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className='bg-black/75 focus:bg-black border-none'>
                      <SelectTrigger>
                        <SelectValue placeholder='Select language' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='bg-black/75 border-none text-white'>
                      {languages?.map((lang) => (
                        <SelectItem key={lang._id} value={lang.language}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className='hidden'>
                    You can manage email addresses in your{' '}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/*  */}
          <div className='w-full flex items-start gap-2'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='flex flex-col text-white w-full'>
                  <FormLabel className='text-xs'>Password*</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      autoComplete='current-password'
                      className='bg-black/75 transition-colors ease-in  focus:bg-black border-none'
                      placeholder='password'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='hidden'>
                    Sign up with your password
                  </FormDescription>
                  <FormMessage className='text-rose-600' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='passwordConfirm'
              render={({ field }) => (
                <FormItem className='flex flex-col text-white w-full'>
                  <FormLabel className='text-xs'>Confirm Password*</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      autoComplete='current-password'
                      className='bg-black/75 transition-colors ease-in  focus:bg-black border-none'
                      placeholder='confirm password'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='hidden'>
                    Sign up with your password
                  </FormDescription>
                  <FormMessage className='text-rose-600' />
                </FormItem>
              )}
            />
          </div>
          {/*  */}
          <Button
            disabled={loading}
            className='flex items-center gap-1'
            type='submit'
          >
            <p>Sign up</p>
            {loading && (
              <span>
                <Loader2 size={16} className='animate-spin' />
              </span>
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
