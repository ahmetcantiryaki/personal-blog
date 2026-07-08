'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import {
  createCategory,
  createTag,
  deleteCategory,
  deleteTag,
  updateCategory,
  updateTag,
  type ActionResult,
} from '@/app/(panel)/panel/(protected)/taxonomy/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface TaxonomyLocaleFields {
  title: string
  slug: string
  description?: string
}

export interface TaxonomyRow {
  id: number
  key: string
  tr: TaxonomyLocaleFields
  en: TaxonomyLocaleFields
}

interface TaxonomyFormProps {
  categories: TaxonomyRow[]
  tags: TaxonomyRow[]
}

type Kind = 'category' | 'tag'

const LOCALE_LABELS: { code: 'tr' | 'en'; label: string }[] = [
  { code: 'tr', label: 'Türkçe' },
  { code: 'en', label: 'English' },
]

/** Admin taxonomy manager: category + tag CRUD in two tabs. */
export function TaxonomyForm({ categories, tags }: TaxonomyFormProps) {
  return (
    <Tabs defaultValue="categories" className="w-full">
      <TabsList>
        <TabsTrigger value="categories">Kategoriler</TabsTrigger>
        <TabsTrigger value="tags">Etiketler</TabsTrigger>
      </TabsList>

      <TabsContent value="categories">
        <TaxonomySection
          kind="category"
          items={categories}
          withDescription
          createAction={createCategory}
          updateAction={updateCategory}
          deleteAction={deleteCategory}
        />
      </TabsContent>

      <TabsContent value="tags">
        <TaxonomySection
          kind="tag"
          items={tags}
          withDescription={false}
          createAction={createTag}
          updateAction={updateTag}
          deleteAction={deleteTag}
        />
      </TabsContent>
    </Tabs>
  )
}

interface TaxonomySectionProps {
  kind: Kind
  items: TaxonomyRow[]
  withDescription: boolean
  createAction: (formData: FormData) => Promise<ActionResult>
  updateAction: (id: number, formData: FormData) => Promise<ActionResult>
  deleteAction: (id: number) => Promise<ActionResult>
}

function TaxonomySection({
  kind,
  items,
  withDescription,
  createAction,
  updateAction,
  deleteAction,
}: TaxonomySectionProps) {
  const router = useRouter()
  const [creating, setCreating] = React.useState(false)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [deletingId, setDeletingId] = React.useState<number | null>(null)

  const noun = kind === 'category' ? 'Kategori' : 'Etiket'

  const onDelete = async (row: TaxonomyRow) => {
    const label = row.tr.title || row.en.title || row.key
    if (!window.confirm(`"${label}" ${noun.toLowerCase()}si silinsin mi?`)) return
    setDeletingId(row.id)
    const res = await deleteAction(row.id)
    setDeletingId(null)
    if (res.ok) {
      toast.success(`${noun} silindi.`)
      router.refresh()
    } else {
      toast.error(res.error ?? 'Silme işlemi başarısız oldu.')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} {noun.toLowerCase()} kayıtlı.
        </p>
        <Button
          type="button"
          size="sm"
          variant={creating ? 'secondary' : 'default'}
          onClick={() => {
            setCreating((v) => !v)
            setEditingId(null)
          }}
        >
          {creating ? 'Vazgeç' : `Yeni ${noun.toLowerCase()}`}
        </Button>
      </div>

      {creating ? (
        <Card>
          <CardContent className="p-6">
            <EntryForm
              mode="create"
              withDescription={withDescription}
              submit={createAction}
              successMessage={`${noun} oluşturuldu.`}
              onDone={() => setCreating(false)}
            />
          </CardContent>
        </Card>
      ) : null}

      <ul className="flex flex-col gap-3">
        {items.map((row) => (
          <li key={row.id}>
            <Card>
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{row.tr.title || row.en.title || '—'}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-mono">key: {row.key}</span>
                      {' · '}
                      TR /{row.tr.slug || '—'} · EN /{row.en.slug || '—'}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId((id) => (id === row.id ? null : row.id))
                        setCreating(false)
                      }}
                    >
                      {editingId === row.id ? 'Kapat' : 'Düzenle'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      disabled={deletingId === row.id}
                      onClick={() => onDelete(row)}
                    >
                      {deletingId === row.id ? 'Siliniyor…' : 'Sil'}
                    </Button>
                  </div>
                </div>

                {editingId === row.id ? (
                  <div className="border-t border-border/60 pt-4">
                    <EntryForm
                      mode="edit"
                      row={row}
                      withDescription={withDescription}
                      submit={(formData) => updateAction(row.id, formData)}
                      successMessage={`${noun} güncellendi.`}
                      onDone={() => setEditingId(null)}
                    />
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="rounded-md border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
            Henüz {noun.toLowerCase()} eklenmedi.
          </li>
        ) : null}
      </ul>
    </div>
  )
}

interface EntryFormProps {
  mode: 'create' | 'edit'
  row?: TaxonomyRow
  withDescription: boolean
  submit: (formData: FormData) => Promise<ActionResult>
  successMessage: string
  onDone: () => void
}

function EntryForm({ mode, row, withDescription, submit, successMessage, onDone }: EntryFormProps) {
  const router = useRouter()
  const formRef = React.useRef<HTMLFormElement>(null)
  const [pending, setPending] = React.useState(false)

  const handle = async (formData: FormData) => {
    setPending(true)
    const res = await submit(formData)
    setPending(false)
    if (res.ok) {
      toast.success(successMessage)
      if (mode === 'create') formRef.current?.reset()
      router.refresh()
      onDone()
    } else {
      toast.error(res.error ?? 'İşlem başarısız oldu.')
    }
  }

  return (
    <form ref={formRef} action={handle} className="flex flex-col gap-5">
      {mode === 'create' ? (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="key">Anahtar (key)</Label>
          <Input
            id="key"
            name="key"
            required
            placeholder="ör. yapay-zeka"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          />
          <p className="text-xs text-muted-foreground">
            Diller arasında ortak, kalıcı kimlik. Oluşturduktan sonra değiştirilemez.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <Label>Anahtar (key)</Label>
          <Input value={row?.key ?? ''} readOnly disabled className="font-mono" />
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {LOCALE_LABELS.map(({ code, label }) => {
          const defaults = row?.[code]
          return (
            <fieldset key={code} className="flex flex-col gap-3 rounded-md border border-border/60 p-4">
              <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
              </legend>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`${code}.title`}>Başlık</Label>
                <Input
                  id={`${code}.title`}
                  name={`${code}.title`}
                  required
                  defaultValue={defaults?.title ?? ''}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`${code}.slug`}>Slug</Label>
                <Input
                  id={`${code}.slug`}
                  name={`${code}.slug`}
                  defaultValue={defaults?.slug ?? ''}
                  placeholder="Boş bırakılırsa başlıktan üretilir"
                />
              </div>
              {withDescription ? (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${code}.description`}>Açıklama</Label>
                  <textarea
                    id={`${code}.description`}
                    name={`${code}.description`}
                    rows={3}
                    defaultValue={defaults?.description ?? ''}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              ) : null}
            </fieldset>
          )
        })}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Kaydediliyor…' : 'Kaydet'}
        </Button>
        <Button type="button" variant="ghost" onClick={onDone} disabled={pending}>
          Vazgeç
        </Button>
      </div>
    </form>
  )
}
