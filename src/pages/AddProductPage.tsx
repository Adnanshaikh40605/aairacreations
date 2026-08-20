import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../api/index.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Field, Input, Select, TextArea } from '../components/ui/Field.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'
import { useShowrooms, useToken } from '../hooks/useApi.ts'

const schema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  category: z.string().min(2),
  subcategory: z.string().optional(),
  material: z.string().optional(),
  woodType: z.string().optional(),
  color: z.string().optional(),
  finish: z.string().optional(),
  size: z.string().optional(),
  dimensions: z.string().optional(),
  condition: z.string().optional(),
  purchaseDate: z.string().optional(),
  supplier: z.string().optional(),
  purchasedFrom: z.string().optional(),
  showroomId: z.string().min(1),
  purchasePrice: z.coerce.number().min(0),
  description: z.string().optional(),
})

type Form = z.infer<typeof schema>

export interface AddProductPageProps {
  className?: string
}

export function AddProductPage(_props: AddProductPageProps) {
  const { user } = useAuth()
  const { data: showrooms } = useShowrooms()
  const token = useToken()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      showroomId: user?.showroomId ?? showrooms?.[0]?.id ?? '',
      purchasePrice: 0,
      purchaseDate: '2026-08-20',
    },
  })
  const mutate = useMutation({
    mutationFn: (values: Form) => api.createProduct(token, { ...values, quantity: 1 }),
    onSuccess: (p) => {
      void qc.invalidateQueries({ queryKey: ['products'] })
      navigate(`/inventory/${p.id}/costing`)
    },
  })

  return (
    <>
      <TopBar title="Add product" backTo="/inventory" />
      <form
        className="space-y-3 px-4 pt-3"
        onSubmit={form.handleSubmit((v) => mutate.mutate(v))}
      >
        <Field label="Product name" error={form.formState.errors.name?.message}>
          <Input {...form.register('name')} />
        </Field>
        <Field label="Product code">
          <Input className="font-mono" {...form.register('code')} />
        </Field>
        <Field label="Category">
          <Input {...form.register('category')} placeholder="Sofa" />
        </Field>
        <Field label="Subcategory">
          <Input {...form.register('subcategory')} />
        </Field>
        <Field label="Material">
          <Input {...form.register('material')} placeholder="Teak Wood" />
        </Field>
        <Field label="Wood type">
          <Input {...form.register('woodType')} />
        </Field>
        <Field label="Color / finish">
          <div className="grid grid-cols-2 gap-2">
            <Input {...form.register('color')} placeholder="Color" />
            <Input {...form.register('finish')} placeholder="Finish" />
          </div>
        </Field>
        <Field label="Size / dimensions">
          <div className="grid grid-cols-2 gap-2">
            <Input {...form.register('size')} placeholder="Size" />
            <Input {...form.register('dimensions')} placeholder="L × W × H" />
          </div>
        </Field>
        <Field label="Condition">
          <Input {...form.register('condition')} placeholder="Refurbished" />
        </Field>
        <Field label="Purchase date">
          <Input type="date" {...form.register('purchaseDate')} />
        </Field>
        <Field label="Supplier">
          <Input {...form.register('supplier')} />
        </Field>
        <Field label="Purchased from">
          <Input {...form.register('purchasedFrom')} />
        </Field>
        {user?.role === 'owner' ? (
          <Field label="Showroom">
            <Select {...form.register('showroomId')}>
              {(showrooms ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.city}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}
        <Field label="Purchase price (₹)">
          <Input className="font-mono" type="number" {...form.register('purchasePrice')} />
        </Field>
        <Field label="Description">
          <TextArea {...form.register('description')} />
        </Field>
        <Button type="submit" disabled={mutate.isPending}>
          Save and cost
        </Button>
      </form>
    </>
  )
}
