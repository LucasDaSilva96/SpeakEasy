'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { useEffect, useState } from 'react';
import { LanguageType } from '@/types/language.types';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAvailableLanguages } from '@/lib/actions/languages.actions';
import { UserType } from '@/types/user.types';
import { updateAccountValidation } from '@/lib/validation/updateAccountValidation';
import Image from 'next/image';
import { updateAccount } from '@/lib/actions/user.actions';

interface UpdateAccountFormProps {
  user: UserType;
}

export default function UpdateAccountForm({ user }: UpdateAccountFormProps) {
  const [languages, setLanguages] = useState<LanguageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string>(
    user?.image || '/default-avatar.png'
  );
  const [file, setFile] = useState<File | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]));
  }

  useEffect(() => {
    getAvailableLanguages().then((res) => {
      if (!res) return [];
      const languages = JSON.parse(res as any);
      setLanguages(languages);
    });
  }, [user.id]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof updateAccountValidation>>({
    resolver: zodResolver(updateAccountValidation),
    defaultValues: {
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      nativeLanguage: user.native_language.name,
      image: image,
      password: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof updateAccountValidation>) {
    // ✅ This will be type-safe and validated.
    try {
      setLoading(true);
      const formData = new FormData();
      if (file) {
        formData.append('image', file);
      }
      if (values.password) {
        formData.append('password', values.password);
      }
      formData.append('email', values.email);
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('nativeLanguage', values.nativeLanguage);

      await updateAccount(formData);
      toast.success('Account updated successfully');
    } catch (e: any) {
      console.error(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex-center-col gap-4 p-1 rounded-md text-black'
      >
        <div className='flex-center gap-2'>
          <Input
            name='image'
            type='file'
            accept='image/*'
            onChange={handleChange}
            className='max-w-[200px] overflow-hidden cursor-pointer border hover:border-blue hover:shadow-blue'
          />
          <div className='w-24 h-24 relative rounded-full overflow-clip'>
            <Image
              sizes='(max-width: 200px) 100vw, (max-width: 300px) 50vw, 33vw'
              src={image}
              alt={user.first_name + 'profile image'}
              fill
              loading='eager'
              style={{
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
        <div className='w-full flex items-start gap-2'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem className='flex flex-col w-full'>
                <FormLabel className='text-xs text-white'>
                  First Name*
                </FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    autoComplete='given-name'
                    className=' transition-colors ease-in  border-none'
                    placeholder='John'
                    {...field}
                  />
                </FormControl>
                <FormDescription className='hidden'>
                  Update your first name
                </FormDescription>
                <FormMessage className='text-rose-600' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem className='flex flex-col w-full'>
                <FormLabel className='text-xs text-white'>Last Name*</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    autoComplete='family-name'
                    className=' transition-colors ease-in  border-none'
                    placeholder='Doe'
                    {...field}
                  />
                </FormControl>
                <FormDescription className='hidden'>
                  Update your last name
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
              <FormItem className='flex flex-col w-full'>
                <FormLabel className='text-xs text-white'>Email*</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    autoComplete='email'
                    className=' transition-colors ease-in  border-none'
                    placeholder='example@io.com'
                    {...field}
                  />
                </FormControl>
                <FormDescription className='hidden'>
                  Update your email
                </FormDescription>
                <FormMessage className='text-rose-600' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='nativeLanguage'
            render={({ field }) => (
              <FormItem className='flex flex-col gap-0.5 w-full relative'>
                <FormLabel className='text-white text-xs'>
                  Native Language*
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={user.native_language.id.toString()}
                >
                  <FormControl className=' border-none'>
                    <SelectTrigger>
                      <SelectValue placeholder='Select language' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className=' border-none max-h-[40vh]'>
                    {languages.length > 0 &&
                      languages.map((lang) => (
                        <SelectItem key={lang.id} value={`${lang.id}`}>
                          {lang.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormDescription className='hidden'>
                  Update your native language
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
              <FormItem className='flex flex-col w-full'>
                <FormLabel className='text-xs text-white'>
                  Update password
                </FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    autoComplete='current-password'
                    className='transition-colors ease-in border-none'
                    placeholder='password'
                    {...field}
                  />
                </FormControl>
                <FormDescription className='hidden'>
                  Update your password
                </FormDescription>
                <FormMessage className='text-rose-600' />
              </FormItem>
            )}
          />
        </div>
        {/*  */}
        <Button
          disabled={loading}
          className='flex items-center gap-1 bg-brown hover:bg-brown/75'
          type='submit'
        >
          <p>Save</p>
          {loading && (
            <span>
              <Loader2 size={16} className='animate-spin' />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
