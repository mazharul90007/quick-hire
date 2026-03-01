const Heading = ({ first, second }: { first: string; second: string }) => {
  return (
    <div>
      <h2 className="text-4xl md:text-5xl font-semibold font-clash text-[#2D2D2D]">
        {first} <span className="text-[#26A4FF]">{second}</span>
      </h2>
    </div>
  );
};

export default Heading;
