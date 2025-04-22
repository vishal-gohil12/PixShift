interface ResizeOptions {
    width: number;
    height: number;
}

interface CropOptions {
    width: number;
    height: number;
    x: number;
    y: number;
}

interface FilterOptions {
    grayscale?: boolean;
    sepia?: boolean;
}

export interface ImageTransformationOptions {
    resize?: ResizeOptions;
    crop?: CropOptions;
    rotate?: number;              
    format?: 'jpeg' | 'png' | 'webp' | 'tiff' | 'avif' | 'gif'; 
    filters?: FilterOptions;
}
