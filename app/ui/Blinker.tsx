const Blinker = ({ color }: { color: string }) => {
  return (
    <span className="relative flex items-center justify-center aspect-square h-3 w-3">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full"
        style={{ backgroundColor: `${color}75` }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ backgroundColor: color }}
      />
    </span>
  );
};

export default Blinker;
