export default function IdeaCard({ idea, onMarkPosted }) {
  return (
    <div className="idea-card">
      <div className="idea-card-header">
        <span className="idea-niche">{idea.niche}</span>
        <span className={`idea-status idea-status-${idea.status}`}>
          {idea.status === 'posted' ? '✅ Posted' : idea.status === 'saved' ? '📌 Saved' : '✨ Generated'}
        </span>
      </div>
      <h3 className="idea-title">{idea.title}</h3>
      {idea.hook && (
        <div className="idea-hook">
          <strong>Hook:</strong> {idea.hook}
        </div>
      )}
      {idea.script && (
        <div className="idea-script">
          <strong>Script Preview:</strong>
          <p>{idea.script.substring(0, 200)}{idea.script.length > 200 ? '...' : ''}</p>
        </div>
      )}
      <div className="idea-card-footer">
        <span className="idea-platform">{idea.platform}</span>
        {idea.status !== 'posted' && onMarkPosted && (
          <button className="btn btn-sm btn-primary" onClick={() => onMarkPosted(idea.id)}>
            Mark as Posted
          </button>
        )}
      </div>
    </div>
  );
}