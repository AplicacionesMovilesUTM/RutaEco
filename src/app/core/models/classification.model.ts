export interface ClassificationModel {
  id?: string;
  material: string;
  type: string;
  confidence: number;
  container: string;
  degradationTime: string;
  recommendations: string[];
  createdAt?: string;
  imageUrl?: string;
}
