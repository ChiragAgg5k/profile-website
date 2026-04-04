export default function GitHub({ id }: { id: string }) {
  return (
    <a
      href={`https://github.com/${id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="w-full">
        <iframe
          className="w-full h-32 border-0 pointer-events-none"
          src={`https://github-readme-stats.vercel.app/api/pin/?username=${id.split("/")[0]}&repo=${id.split("/")[1]}&theme=default&show_icons=true`}
          title="GitHub Repository Card"
          frameBorder="0"
        ></iframe>
      </div>
    </a>
  );
}
