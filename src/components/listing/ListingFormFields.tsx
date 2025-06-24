"use client"

import type { UseFormReturn } from "react-hook-form"
import type { z } from "zod"
import type { listingFormSchema } from "~/lib/validators/listingFormSchema"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { accommodationCategories } from "~/lib/accomodation-categores"
import { Checkbox } from "~/components/ui/checkbox"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Calendar } from "~/components/ui/calendar"
import { cn } from "~/lib/utils"
import { ImageUploader } from "./ImageUploader"

type FormData = z.infer<typeof listingFormSchema>

type Props = {
  form: UseFormReturn<FormData>
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
}

const genderOptions = ["Male", "Female", "All"] as const
const roomTypes = ["Private", "Shared", "Entire Place"] as const
const basicAmenities = ["Wi-Fi", "Meals", "AC", "Parking", "Laundry"] as const

export function ListingFormFields({ form, files, setFiles }: Props) {
  const selectedCategory = accommodationCategories.find(
    (cat) => cat.value === form.watch("category")
  )

  return (
    <>
      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} rows={4} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Category */}
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <select {...field} className="w-full border p-2 rounded">
                <option value="">Select a category</option>
                {accommodationCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Subcategory */}
      {selectedCategory && (
        <FormField
          control={form.control}
          name="subcategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory</FormLabel>
              <FormControl>
                <select {...field} className="w-full border p-2 rounded">
                  <option value="">Select a subcategory</option>
                  {selectedCategory.subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Room Type */}
      <FormField
        control={form.control}
        name="roomType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Room Type</FormLabel>
            <FormControl>
              <select {...field} className="w-full border p-2 rounded">
                <option value="">Select a room type</option>
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Gender Allowed */}
      <FormField
        control={form.control}
        name="genderAllowed"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender Allowed</FormLabel>
            <FormControl>
              <select {...field} className="w-full border p-2 rounded">
                {genderOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Price */}
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price (₹ per month/day)</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value
                  field.onChange(value === "" ? null : Number(value))
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Is Free */}
      <FormField
        control={form.control}
        name="isFree"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFree"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label htmlFor="isFree">This is a free stay</label>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {/* Amenities */}
      <FormField
        control={form.control}
        name="amenities"
        render={() => (
          <FormItem>
            <FormLabel>Amenities</FormLabel>
            <div className="flex flex-wrap gap-3">
              {basicAmenities.map((item) => (
                <label key={item} className="flex items-center space-x-2">
                  <Checkbox
                    checked={form.watch("amenities").includes(item)}
                    onCheckedChange={(checked) => {
                      const current = form.getValues("amenities") ?? []
                      if (checked) {
                        form.setValue("amenities", [...current, item])
                      } else {
                        form.setValue(
                          "amenities",
                          current.filter((i) => i !== item)
                        )
                      }
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </FormItem>
        )}
      />

      {/* Locality */}
      <FormField
        control={form.control}
        name="locality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Locality</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City */}
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* District */}
      <FormField
        control={form.control}
        name="district"
        render={({ field }) => (
          <FormItem>
            <FormLabel>District</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* State */}
      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Available From */}
      <FormField
        control={form.control}
        name="availableFrom"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Available From</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    type="button"
                    className={cn(
                      "w-full border p-2 rounded text-left",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                    <CalendarIcon className="inline-block ml-2 h-4 w-4" />
                  </button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Images</FormLabel>
            <ImageUploader
              files={files}
              setFiles={setFiles}
              onChange={field.onChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}