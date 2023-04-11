import { useState } from 'react';
import './styles/global.css';

/**
 * To-do
 * 
 * [ ] Validação / transformação
 * [ ] Field Arrays
 * [ ] Upload de arquivos
 * [ ] Composition Pattern
 */

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createUserFormSchema = z.object({
  name: z.string()
    .nonempty('O nome é obrigatório')
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1))
      }).join(' ')
    }),

  email: z.string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .toLowerCase()
    .endsWith('@gmail.com', 'Você precisa usar uma conta Google'),
  /* .refine(email => {
    return email.endsWith('@gmail.com')
  }, 'Você precisa usar uma conta Google'), */
  // aqui vocÊ pode usar o refine, endWith ou até mesmo o superRefine (recomendado para confirmação de senha)

  password: z.string()
    .min(6, 'A senha precisa de no mínimo 6 caracteres'),
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export function App() {
  const [output, setOutput] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  function createUser(data: CreateUserFormData) {
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)} // High-order function
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            className='border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white'
            {...register('name')}
          />
          {errors.name && <span className="">{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className='border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white'
            {...register('email')}
          />
          {errors.email && <span className="">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            className='border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white'
            {...register('password')}
          />
          {errors.password && <span className="">{errors.password.message}</span>}

        </div>

        <button
          type="submit"
          className='bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600'
        >
          Salvar
        </button>
      </form>

      <pre>{output}</pre>
    </main>

  )
}

