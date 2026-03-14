import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Camera, PawPrint, Upload, Loader2, X, Video, Square, ImagePlus, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const ListPet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form state
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState<string>("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [vaccinated, setVaccinated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Breed fetching
  const [breeds, setBreeds] = useState<string[]>([]);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);

  // Image upload state
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Video recording state
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Fetch breeds when petType changes
  useEffect(() => {
    const fetchBreeds = async () => {
      setBreeds([]);
      setBreed("");

      if (petType === "dog") {
        setIsLoadingBreeds(true);
        try {
          const res = await fetch("https://dog.ceo/api/breeds/list/all");
          const data = await res.json();
          if (data.status === "success") {
            const flattenedBreeds: string[] = [];
            Object.entries(data.message).forEach(([breed, subBreeds]: [string, any]) => {
              if (subBreeds.length === 0) {
                flattenedBreeds.push(breed.charAt(0).toUpperCase() + breed.slice(1));
              } else {
                subBreeds.forEach((sub: string) => {
                  flattenedBreeds.push(
                    `${sub.charAt(0).toUpperCase() + sub.slice(1)} ${breed.charAt(0).toUpperCase() + breed.slice(1)}`
                  );
                });
              }
            });
            setBreeds(flattenedBreeds.sort());
          }
        } catch (error) {
          console.error("Failed to fetch dog breeds", error);
        } finally {
          setIsLoadingBreeds(false);
        }
      } else if (petType === "cat") {
        setIsLoadingBreeds(true);
        try {
          const res = await fetch("https://api.thecatapi.com/v1/breeds");
          const data = await res.json();
          if (Array.isArray(data)) {
            const catBreeds = data.map((cat: any) => cat.name);
            setBreeds(catBreeds.sort());
          }
        } catch (error) {
          console.error("Failed to fetch cat breeds", error);
        } finally {
          setIsLoadingBreeds(false);
        }
      }
    };

    fetchBreeds();
  }, [petType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      stopCamera();
    };
  }, []);

  // Image handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 5));
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Camera / Video handlers
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      alert("Camera access denied. Please allow camera permissions to record a video.");
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setIsRecording(false);
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current, { mimeType: "video/webm" });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setVideoBlob(blob);
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      stopCamera();
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const removeVideo = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoBlob(null);
    setVideoUrl(null);
  };

  // ============ FORM SUBMISSION ============
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!user) {
      navigate("/login");
      return;
    }

    if (images.length === 0) {
      setSubmitError("Please upload at least one photo of your pet.");
      return;
    }
    if (!petName || !petType || !breed || !age || !gender || !location || !description) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload images to Supabase Storage
      const imageUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const file = images[i].file;
        const ext = file.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}_${i}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("pet-images")
          .upload(filePath, file, { upsert: false });

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("pet-images")
          .getPublicUrl(filePath);

        imageUrls.push(urlData.publicUrl);
      }

      // 2. Upload video if recorded
      let uploadedVideoUrl: string | null = null;
      if (videoBlob) {
        const videoPath = `${user.id}/${Date.now()}_video.webm`;

        const { error: videoUploadError } = await supabase.storage
          .from("pet-videos")
          .upload(videoPath, videoBlob, { upsert: false, contentType: "video/webm" });

        if (videoUploadError) {
          throw new Error(`Video upload failed: ${videoUploadError.message}`);
        }

        const { data: videoUrlData } = supabase.storage
          .from("pet-videos")
          .getPublicUrl(videoPath);

        uploadedVideoUrl = videoUrlData.publicUrl;
      }

      // 3. Insert pet record into the database
      const { error: insertError } = await supabase.from("pets").insert({
        owner_id: user.id,
        name: petName,
        type: petType as "dog" | "cat" | "other",
        breed,
        age,
        gender: gender as "male" | "female",
        vaccinated,
        price: parseInt(price) || 0,
        location,
        description,
        images: imageUrls,
        video_url: uploadedVideoUrl,
        is_live: !!uploadedVideoUrl,
        is_available: true,
      });

      if (insertError) {
        throw new Error(`Failed to save listing: ${insertError.message}`);
      }

      // Success! Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-1 bg-[#FDF9F5] py-12 overflow-hidden">
        <div className="container max-w-[800px] relative">
          <Card className="bg-white/90 backdrop-blur-3xl shadow-none border border-black/5 rounded-[40px] px-2 sm:px-8 py-4 animate-in">
            <CardHeader className="pb-6">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FFAD40] to-[#FF8C00] shadow-sm">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="font-heading text-2xl">List Your <span className="text-gradient-warm">Pet</span></CardTitle>
              <CardDescription>
                Fill in the details below to help find a loving home for your pet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* ===== IMAGE UPLOAD ===== */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <Label className="text-[15px] font-bold text-black/90 tracking-wide">Pet Photos *</Label>
                    <p className="text-sm text-muted-foreground font-medium">Upload up to 5 photos of your pet</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {images.map((img, i) => (
                      <div key={i} className="relative h-28 w-28 rounded-2xl overflow-hidden group shadow-sm border border-white/30">
                        <img src={img.preview} alt={`Pet photo ${i + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] font-bold text-center py-0.5">MAIN</span>
                        )}
                      </div>
                    ))}

                    {images.length < 5 && (
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className={`flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed transition-all duration-300 ${
                          images.length === 0
                            ? "border-[#FF6B2B]/40 bg-[#FFF5F0] hover:border-[#FF6B2B]/60"
                            : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
                        }`}
                      >
                        {images.length === 0 ? (
                          <><Camera className="mb-2 h-7 w-7 text-[#FF6B2B]" strokeWidth={1.5} /><span className="text-[11px] font-medium text-black/70">Main Photo</span></>
                        ) : (
                          <><ImagePlus className="mb-2 h-7 w-7 text-muted-foreground" /><span className="text-[11px] font-medium text-muted-foreground">Add More</span></>
                        )}
                      </button>
                    )}
                  </div>

                  <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                </div>

                {/* ===== VIDEO SECTION ===== */}
                <div className="space-y-4 pt-6">
                  <div className="space-y-1">
                    <Label className="text-[15px] font-bold text-black/90 tracking-wide">Live Video</Label>
                    <p className="text-sm text-muted-foreground font-medium">Record a short video showing your pet (recommended)</p>
                  </div>

                  {showCamera && (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow-card bg-black animate-in fade-in">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video object-cover" />
                      {isRecording && (
                        <div className="absolute top-3 left-3 flex items-center gap-2 bg-destructive/90 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
                          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                          Recording...
                        </div>
                      )}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3">
                        {!isRecording ? (
                          <Button type="button" onClick={startRecording} className="rounded-full h-14 w-14 bg-destructive hover:bg-destructive/80 shadow-lg border-4 border-white/30">
                            <div className="h-5 w-5 rounded-full bg-white" />
                          </Button>
                        ) : (
                          <Button type="button" onClick={stopRecording} className="rounded-full h-14 w-14 bg-destructive hover:bg-destructive/80 shadow-lg border-4 border-white/30">
                            <Square className="h-5 w-5 text-white fill-white" />
                          </Button>
                        )}
                        <Button type="button" variant="outline" onClick={stopCamera} className="rounded-full h-14 w-14 glass border-white/30 text-white hover:bg-white/20">
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {videoUrl && !showCamera && (
                    <div className="relative rounded-2xl overflow-hidden border border-white/30 shadow-sm animate-in fade-in">
                      <video src={videoUrl} controls className="w-full aspect-video object-cover rounded-2xl" />
                      <button type="button" onClick={removeVideo} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-destructive transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                      <span className="absolute bottom-2 left-2 bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                        <CheckCircle2 className="h-3 w-3" /> Video Ready
                      </span>
                    </div>
                  )}

                  {!showCamera && !videoUrl && (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="flex w-full cursor-pointer items-center gap-5 rounded-3xl border border-dashed border-[#1DB954]/40 bg-[#F4FBF7] p-6 transition-all duration-300 hover:border-[#1DB954]/60 group"
                    >
                      <div className="flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#FFAD40] to-[#FF8C00] shadow-sm transform transition-transform group-hover:scale-105">
                        <Video className="h-7 w-7 text-white" strokeWidth={1.5} />
                      </div>
                      <div className="text-left">
                        <p className="text-[15px] font-bold text-black/90">Record Live Video</p>
                        <p className="text-[13px] text-muted-foreground mt-0.5">Use your camera to record a short clip of your pet</p>
                      </div>
                    </button>
                  )}
                </div>

                {/* ===== FORM FIELDS ===== */}
                <div className="grid gap-6 sm:grid-cols-2 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="petName" className="text-[13px] font-medium text-black/80">Pet Name *</Label>
                    <Input id="petName" placeholder="e.g. Buddy" className="h-12 rounded-[14px] bg-white border-black/10 text-[15px] shadow-none focus-visible:ring-1 focus-visible:ring-primary/30" value={petName} onChange={(e) => setPetName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-black/80">Pet Type *</Label>
                    <Select onValueChange={(value) => setPetType(value)} required>
                      <SelectTrigger className="h-12 rounded-[14px] bg-white border-black/10 text-[15px] shadow-none focus:ring-1 focus:ring-primary/30">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="breed" className="text-[13px] font-medium text-black/80">Breed *</Label>
                    {isLoadingBreeds ? (
                      <div className="flex h-12 items-center rounded-[14px] border border-black/10 bg-white px-3 text-[15px] text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading breeds...
                      </div>
                    ) : breeds.length > 0 ? (
                      <Select onValueChange={(value) => setBreed(value)}>
                        <SelectTrigger className="h-12 rounded-[14px] bg-white border-black/10 text-[15px] shadow-none focus:ring-1 focus:ring-primary/30">
                          <SelectValue placeholder={`Select ${petType} breed`} />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {breeds.map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="breed" placeholder="e.g. Golden Retriever" className="h-12 rounded-[14px] bg-white border-black/10 text-[15px] shadow-none focus-visible:ring-1 focus-visible:ring-primary/30" value={breed} onChange={(e) => setBreed(e.target.value)} required />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-[13px] font-medium text-black/80">Age *</Label>
                    <Input id="age" placeholder="e.g. 2 years" className="h-12 rounded-[14px] bg-white border-black/10 text-[15px] shadow-none focus-visible:ring-1 focus-visible:ring-primary/30" value={age} onChange={(e) => setAge(e.target.value)} required />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-black/80">Gender *</Label>
                    <Select onValueChange={(value) => setGender(value)} required>
                      <SelectTrigger className="h-12 rounded-[14px] bg-white border-black/10 text-[15px] shadow-none focus:ring-1 focus:ring-primary/30">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-[13px] font-medium text-black/80">Price / Adoption Fee (₹)</Label>
                    <Input id="price" type="number" placeholder="0 for free adoption" className="h-12 rounded-[14px] bg-white border-black/10 text-[15px] shadow-none focus-visible:ring-1 focus-visible:ring-primary/30" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-[13px] font-medium text-black/80">Location *</Label>
                  <Input id="location" placeholder="e.g. Mumbai, Maharashtra" className="h-12 rounded-[14px] bg-white border-black/10 text-[15px] shadow-none focus-visible:ring-1 focus-visible:ring-primary/30" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[13px] font-medium text-black/80">Description *</Label>
                  <Textarea id="description" placeholder="Tell potential adopters about your pet's personality, habits, and needs..." rows={4} className="rounded-[14px] bg-white border-black/10 text-[15px] shadow-none focus-visible:ring-1 focus-visible:ring-primary/30" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>

                <div className="flex items-center justify-between rounded-2xl glass p-5">
                  <div>
                    <Label className="text-base font-heading font-bold">Vaccinated</Label>
                    <p className="text-sm text-muted-foreground">Is your pet fully vaccinated?</p>
                  </div>
                  <Switch checked={vaccinated} onCheckedChange={setVaccinated} />
                </div>

                {/* Error message */}
                {submitError && (
                  <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
                    {submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-gradient-warm hover:opacity-90 transition-opacity border-0 shadow-glow text-base font-heading font-bold"
                  size="lg"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Uploading & Publishing...</>
                  ) : (
                    "Publish Listing"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListPet;
