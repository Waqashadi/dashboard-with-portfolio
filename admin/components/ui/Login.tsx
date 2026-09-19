import React from 'react';

export interface Props {
  [key: string]: any;
}

export default function (props: Props) {
  return (
    <div className="p-4 border border-dashed border-yellow-500/50 rounded-lg bg-yellow-500/10 text-yellow-200">
      <p className="font-mono text-sm">[Stub Component]: </p>
    </div>
  );
}