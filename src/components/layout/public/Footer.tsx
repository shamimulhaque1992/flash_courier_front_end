export default function Footer() {
  return (
    <footer className="w-full h-16 border-t flex justify-center items-center">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Flash Courier. All rights reserved.
      </p>
    </footer>
  );
}
