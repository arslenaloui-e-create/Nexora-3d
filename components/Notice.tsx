export type NoticeState = { kind: 'ok' | 'error' | 'info'; text: string } | null;

export default function Notice({ value }: { value: NoticeState }) {
  if (!value) return null;
  return <div className={`alert alert-${value.kind}`} role={value.kind === 'error' ? 'alert' : 'status'}>{value.text}</div>;
}
