import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "How does online image compression work?",
      answer: "Our tool compresses images directly in your browser using advanced algorithms. It reduces file sizes by optimizing compression without uploading to any server, ensuring complete privacy. The process analyzes your image and applies smart compression techniques to maintain quality while significantly reducing file size."
    },
    {
      question: "Is it safe to compress images online?",
      answer: "Absolutely! All image processing happens locally in your browser using client-side JavaScript. Your images never leave your device or get uploaded to any server. This privacy-first approach means your photos remain completely secure and confidential."
    },
    {
      question: "What image formats can I compress?",
      answer: "You can compress JPG, JPEG, PNG, WebP, HEIC, AVIF, BMP, SVG, and TIFF formats. Our tool supports all major image formats and can also convert between them. Simply upload your images and choose your desired output format."
    },
    {
      question: "How much can I reduce image file size?",
      answer: "Compression results vary by image type and content, but you can typically reduce file sizes by 50-80% without noticeable quality loss. Our smart compression presets (200KB, 100KB, 50KB) automatically optimize for specific target sizes while maintaining the best possible quality."
    },
    {
      question: "Can I compress multiple images at once?",
      answer: "Yes! You can upload and compress up to 10 images simultaneously. After processing, you can download them individually or as a single ZIP file for convenience. This batch processing feature saves time when working with multiple images."
    },
    {
      question: "What are the best settings for Instagram or Shopify images?",
      answer: "We provide preset resize options optimized for popular platforms: Instagram Square (1080×1080), Instagram Portrait (1080×1350), Shopify (2048×2048), and Etsy (2000×2000). These presets automatically resize and compress your images to meet platform requirements while maintaining optimal quality."
    },
    {
      question: "Will compressing reduce image quality?",
      answer: "Our smart compression algorithm balances file size reduction with quality preservation. For most use cases, the quality difference is imperceptible to the human eye. You can use the before/after preview slider to compare and ensure the compressed version meets your standards."
    },
    {
      question: "How do I convert HEIC to JPG?",
      answer: "Simply upload your HEIC file, and our tool will automatically process it. You can then use the format converter to change it to JPG, PNG, or any other supported format. The conversion happens instantly in your browser with no quality loss."
    }
  ];
  
  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Everything you need to know about compressing and converting images
          </p>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-lg px-6 border"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
