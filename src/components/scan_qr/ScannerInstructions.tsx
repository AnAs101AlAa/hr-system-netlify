const ScannerInstructions = () => {
  return (
    <div className="mt-6 md:mt-8 bg-[var(--color-dashboard-welcome-bg)] rounded-xl p-4 md:p-6">
      <h3 className="text-lg font-semibold text-[var(--color-contrast)] mb-3">
        How to Use
      </h3>
      <ul className="space-y-2 text-sm text-[var(--color-dashboard-description)]">
        <li className="flex items-start">
          <span className="text-primary mr-2 mt-1">•</span>
          Scan the member's QR code to record their attendance
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2 mt-1">•</span>
          If a member is late, provide a reason before confirming
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2 mt-1">•</span>
          Make sure the QR code is well-lit and fully visible
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2 mt-1">•</span>
          Allow camera access when prompted by your browser
        </li>
      </ul>
    </div>
  );
};

export default ScannerInstructions;