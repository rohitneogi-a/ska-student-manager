import { useRef } from "react"
import { Camera, X, Upload, ImageIcon } from "lucide-react"

export default function ImgUpload({
  show,
  onClose,
  selectedFile,
  previewUrl,
  imageError,
  uploadingImage,
  onFileSelect,
  onDrop,
  onUpload,
  fileInputRef,
}) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/40 animate-slideUp">

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-[#2a9d8f] to-[#264653] rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Update Profile Photo</h2>
              <p className="text-xs text-gray-500">JPG only · Max 5 MB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition mb-4 ${
            previewUrl
              ? "border-[#2a9d8f]/60 bg-[#2a9d8f]/5"
              : imageError
              ? "border-red-400 bg-red-50"
              : "border-gray-300 hover:border-[#2a9d8f]/60 hover:bg-[#2a9d8f]/5 bg-gray-50"
          }`}
        >
          {previewUrl ? (
            <div className="flex flex-col items-center gap-3">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-28 h-28 rounded-2xl object-cover shadow-md"
              />
              <p className="text-sm font-semibold text-[#2a9d8f]">{selectedFile?.name}</p>
              <p className="text-xs text-gray-400">
                {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB · Click to change
              </p>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center">
                <ImageIcon className="w-7 h-7 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">
                  Drag & drop or{" "}
                  <span className="text-[#2a9d8f] underline">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG / JPEG only · Max 5 MB</p>
              </div>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,image/jpeg"
            onChange={onFileSelect}
            className="hidden"
          />
        </div>

        {/* Error message */}
        {imageError && (
          <p className="text-xs text-red-500 font-medium mb-4 flex items-center gap-1">
            ✗ {imageError}
          </p>
        )}

        {/* Modal Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition cursor-pointer bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button
            onClick={onUpload}
            disabled={!selectedFile || !!imageError || uploadingImage}
            className="py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition cursor-pointer bg-linear-to-br from-[#2a9d8f] to-[#264653] text-white shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {uploadingImage ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploadingImage ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  )
}