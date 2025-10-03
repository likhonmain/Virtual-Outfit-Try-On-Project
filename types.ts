
export interface ImageFile {
    file: File;
    previewUrl: string;
}

export interface GenerativePart {
    inlineData: {
        data: string;
        mimeType: string;
    };
}
