import { useState } from 'react';
import './styles/global.css';

/**
 * To-do
 * 
 * [x] Validação / transformação
 * [x] Field Arrays
 * [ ] Upload de arquivos
 * [ ] Composition Pattern
 */

import { useForm, useFieldArray } from 'react-hook-form';
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
  }, 'Você precisa usar uma conta Google'), 
  // aqui vocÊ pode usar o refine, endWith ou até mesmo o superRefine (recomendado para confirmação de senha)
  */

  password: z.string()
    .min(6, 'A senha precisa de no mínimo 6 caracteres'),
  techs: z.array(z.object({
    title: z.string().nonempty('O título é obrigatório'),
    knowledge: z.coerce.number().min(1).max(100),
  })).min(2, 'Insira pelo menos 2 tecnologias')
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export function App() {
  const [output, setOutput] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  })

  function addNewTech() {
    append({ title: '', knowledge: 0 })
  }

  function createUser(data: CreateUserFormData) {
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <main className="h-full min-h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)} // High-order function
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            type="text" id="name"
            placeholder='John Doe'
            className='border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 
            text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-100 
            focus:ring-1 focus:ring-zinc-100
            invalid:border-red-400 invalid:text-red-400 
            focus:invalid:border-red-500 focus:invalid:ring-red-500'
            {...register('name')}
          />

          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="email" id="email"
            placeholder='Ex: johndoe@mail.com' autoComplete='off'
            className='h-10 px-3 bg-zinc-800 border border-zinc-600 shadow-sm rounded text-white
            placeholder-zinc-600 focus:outline-none focus:border-zinc-100 focus:ring-1 focus:ring-zinc-100
            invalid:border-red-400 invalid:text-red-400 
            focus:invalid:border-red-500 focus:invalid:ring-red-500'
            {...register('email')}
          />

          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            type="password" id="password"
            className='border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white 
            placeholder-zinc-600 focus:outline-none focus:border-zinc-100 focus:ring-1 focus:ring-zinc-100
            invalid:border-red-400 invalid:text-red-400 
            focus:invalid:border-red-500 focus:invalid:ring-red-500'
            {...register('password')}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="techs" className='flex items-center justify-between'>
            Tecnologias

            <button type='button' onClick={addNewTech} className="text-emerald-500 text-sm">
              Adicionar
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div className="flex gap-2" key={field.id}>
                <div className="flex-1 flex flex-col gap-1">
                  <input
                    type="text"
                    className='border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white'
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && <span className="text-red-500 text-sm">{errors.techs?.[index]?.title?.message}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="number"
                    className='w-16 border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white'
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && <span className="text-red-500 text-sm">{errors.techs?.[index]?.knowledge?.message}</span>}
                </div>

              </div>
            )
          })}

          {errors.techs && <span className="text-red-500 text-sm">{errors.techs.message}</span>}
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

