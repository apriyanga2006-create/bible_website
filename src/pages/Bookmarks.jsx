import { useState, useEffect } from 'react';
import { Copy, Share2, Trash2, Check, BookmarkX } from 'lucide-react';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [copiedRef, setCopiedRef] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setBookmarks(stored);
  }, []);

  const removeBookmark = (refToRemove) => {
    const updated = bookmarks.filter(b => {
      const ref = typeof b === 'string' ? b : b.ref;
      return ref !== refToRemove;
    });
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const copyVerse = (bookmark) => {
    const text = typeof bookmark === 'string' ? bookmark : `${bookmark.ref}\n"${bookmark.text}"`;
    const cleanText = text.replace(/`/g, '');
    navigator.clipboard.writeText(cleanText);
    const ref = typeof bookmark === 'string' ? bookmark : bookmark.ref;
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 3000);
  };

  const shareVerse = async (bookmark) => {
    const textToShare = typeof bookmark === 'string' ? bookmark : `"${bookmark.text}" - ${bookmark.ref}`;
    const cleanText = textToShare.replace(/`/g, '');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Verse from The Holy Bible',
          text: cleanText,
        });
      } catch (err) {
        console.log("Sharing failed or was cancelled", err);
      }
    } else {
      // Fallback if Web Share API is not supported
      copyVerse(bookmark);
      alert('Link copied to clipboard (Sharing not supported on this browser)');
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className="layout">
        <main className="reader" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <BookmarkX size={64} style={{ opacity: 0.3, marginBottom: '20px' }} />
          <h2 style={{ fontSize: '2rem', opacity: 0.8 }}>No bookmarks yet</h2>
          <p style={{ marginTop: '10px', opacity: 0.6 }}>Verses you bookmark while reading will appear here.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="layout" style={{ display: 'block', overflowY: 'auto' }}>
      <main className="reader-container" style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '40px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
          Your Bookmarks
        </h1>
        
        <div className="verses-container">
          {bookmarks.map((b, index) => {
            const isString = typeof b === 'string';
            const ref = isString ? b : b.ref;
            const text = isString ? 'Text unavailable (Legacy bookmark)' : b.text;
            const dateStr = !isString && b.date ? new Date(b.date).toLocaleDateString() : '';

            return (
              <div className="verse" key={index} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="verse-number" style={{ fontSize: '1.1rem', margin: 0 }}>{ref}</span>
                  {dateStr && <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{dateStr}</span>}
                </div>
                
                <p style={{ fontSize: '1.2rem', margin: '10px 0', opacity: isString ? 0.6 : 1, fontStyle: isString ? 'italic' : 'normal' }}>
                  {text}
                </p>
                
                <div className="actions" style={{ opacity: 1, transform: 'none', borderTop: '1px solid var(--border)', paddingTop: '15px', marginTop: '5px' }}>
                  <button onClick={() => copyVerse(b)}>
                    {copiedRef === ref ? <Check size={16} /> : <Copy size={16} />} 
                    {copiedRef === ref ? 'Copied' : 'Copy'}
                  </button>
                  <button onClick={() => shareVerse(b)}>
                    <Share2 size={16} /> Share
                  </button>
                  <button onClick={() => removeBookmark(ref)} style={{ marginLeft: 'auto', color: '#ef4444' }}>
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
