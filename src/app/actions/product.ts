"use server";

import { createClient } from "@supabase/supabase-js";

// Initialize a Supabase client with the Service Role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function upsertProduct(data: {
  id?: string;
  name: string;
  price: number;
  description: string;
  category_id: string;
  gender: string;
  purity: string;
}) {
  try {
    if (data.id) {
      // Update existing product
      const { error } = await supabaseAdmin
        .from("products")
        .update({
          name: data.name,
          price: data.price,
          description: data.description,
          category_id: data.category_id,
          gender: data.gender,
          purity: data.purity,
        })
        .eq("id", data.id);

      if (error) throw error;
      return { success: true, productId: data.id };
    } else {
      // Insert new product
      const { data: newProduct, error } = await supabaseAdmin
        .from("products")
        .insert([
          {
            name: data.name,
            price: data.price,
            description: data.description,
            category_id: data.category_id,
            gender: data.gender,
            purity: data.purity,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, productId: newProduct.id };
    }
  } catch (error: any) {
    console.error("Supabase Admin Error (products):", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProductImages(imageIds: string[]) {
  if (!imageIds || imageIds.length === 0) return { success: true };
  try {
    const { error } = await supabaseAdmin
      .from("product_images")
      .delete()
      .in("id", imageIds);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Supabase Admin Error (delete product_images):", error);
    return { success: false, error: error.message };
  }
}

export async function insertProductImages(productId: string, imageUrls: string[]) {
  if (!imageUrls || imageUrls.length === 0) return { success: true };
  try {
    const records = imageUrls.map(url => ({
      product_id: productId,
      image_url: url
    }));
    const { error } = await supabaseAdmin
      .from("product_images")
      .insert(records);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Supabase Admin Error (insert product_images):", error);
    return { success: false, error: error.message };
  }
}

export async function uploadProductImageToStorage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;
    
    if (!file || !fileName) {
      throw new Error("Missing file or fileName");
    }

    const { error } = await supabaseAdmin.storage
      .from("products")
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("products")
      .getPublicUrl(fileName);

    return { success: true, publicUrl };
  } catch (error: any) {
    console.error("Supabase Admin Error (upload storage):", error);
    return { success: false, error: error.message };
  }
}
