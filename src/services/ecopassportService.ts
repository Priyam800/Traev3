
import { supabase } from '@/integrations/supabase/client';
import { EcoPassport } from '@/types';

// Fetch EcoPassport by ID
export const fetchEcoPassportById = async (id: string): Promise<EcoPassport | null> => {
  try {
    const { data, error } = await supabase
      .from('eco_passports')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      farmerId: data.farmer_id,
      productId: data.product_id || undefined,
      certifications: data.certifications || [],
      sustainabilityScore: data.sustainability_score || 0,
      carbonFootprint: data.carbon_footprint || 0,
      waterUsage: data.water_usage || 0,
      transportDistance: data.transport_distance || 0,
      harvestDate: data.harvest_date || new Date().toISOString(),
      expiryDate: data.expiry_date || new Date().toISOString(),
      qrCodeUrl: data.qr_code_url || '',
    };
  } catch (error) {
    console.error('Error fetching EcoPassport:', error);
    return null;
  }
};

// Fetch EcoPassport by farmer ID
export const fetchEcoPassportByFarmerId = async (farmerId: string): Promise<EcoPassport | null> => {
  try {
    const { data, error } = await supabase
      .from('eco_passports')
      .select('*')
      .eq('farmer_id', farmerId)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      farmerId: data.farmer_id,
      productId: data.product_id || undefined,
      certifications: data.certifications || [],
      sustainabilityScore: data.sustainability_score || 0,
      carbonFootprint: data.carbon_footprint || 0,
      waterUsage: data.water_usage || 0,
      transportDistance: data.transport_distance || 0,
      harvestDate: data.harvest_date || new Date().toISOString(),
      expiryDate: data.expiry_date || new Date().toISOString(),
      qrCodeUrl: data.qr_code_url || '',
    };
  } catch (error) {
    console.error('Error fetching EcoPassport by farmer ID:', error);
    return null;
  }
};

// Update EcoPassport
export const updateEcoPassport = async (ecoPassportData: Partial<EcoPassport>): Promise<boolean> => {
  try {
    if (!ecoPassportData.id) {
      throw new Error('EcoPassport ID is required');
    }
    
    const { error } = await supabase
      .from('eco_passports')
      .update({
        certifications: ecoPassportData.certifications,
        sustainability_score: ecoPassportData.sustainabilityScore,
        carbon_footprint: ecoPassportData.carbonFootprint,
        water_usage: ecoPassportData.waterUsage,
        transport_distance: ecoPassportData.transportDistance,
        harvest_date: ecoPassportData.harvestDate,
        expiry_date: ecoPassportData.expiryDate,
        qr_code_url: ecoPassportData.qrCodeUrl,
      })
      .eq('id', ecoPassportData.id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating EcoPassport:', error);
    return false;
  }
};

// Create new EcoPassport
export const createEcoPassport = async (farmerId: string, ecoPassportData?: Partial<EcoPassport>): Promise<EcoPassport | null> => {
  try {
    // Set default values if not provided
    const defaultData = {
      farmer_id: farmerId,
      certifications: ecoPassportData?.certifications || ['Organic Farming'],
      sustainability_score: ecoPassportData?.sustainabilityScore || 7.5,
      carbon_footprint: ecoPassportData?.carbonFootprint || 450,
      water_usage: ecoPassportData?.waterUsage || 2500,
      transport_distance: ecoPassportData?.transportDistance || 75,
      harvest_date: ecoPassportData?.harvestDate || new Date().toISOString(),
      expiry_date: ecoPassportData?.expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      qr_code_url: ecoPassportData?.qrCodeUrl || '',
    };
    
    const { data, error } = await supabase
      .from('eco_passports')
      .insert(defaultData)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      farmerId: data.farmer_id,
      productId: data.product_id || undefined,
      certifications: data.certifications || [],
      sustainabilityScore: data.sustainability_score || 0,
      carbonFootprint: data.carbon_footprint || 0,
      waterUsage: data.water_usage || 0,
      transportDistance: data.transport_distance || 0,
      harvestDate: data.harvest_date || new Date().toISOString(),
      expiryDate: data.expiry_date || new Date().toISOString(),
      qrCodeUrl: data.qr_code_url || '',
    };
  } catch (error) {
    console.error('Error creating EcoPassport:', error);
    return null;
  }
};

// Ensure a farmer has an EcoPassport
export const ensureFarmerHasEcoPassport = async (farmerId: string): Promise<EcoPassport | null> => {
  try {
    // First check if farmer already has an EcoPassport
    const existing = await fetchEcoPassportByFarmerId(farmerId);
    
    if (existing) {
      return existing;
    }
    
    // If not, create a new one with default values
    return await createEcoPassport(farmerId);
  } catch (error) {
    console.error('Error ensuring farmer has EcoPassport:', error);
    return null;
  }
};

// Link QR code to EcoPassport
export const linkQRCodeToEcoPassport = async (ecoPassportId: string, qrUrl: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('eco_passports')
      .update({ qr_code_url: qrUrl })
      .eq('id', ecoPassportId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error linking QR code to EcoPassport:', error);
    return false;
  }
};
