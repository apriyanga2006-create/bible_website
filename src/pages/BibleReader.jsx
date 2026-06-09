import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Copy, Bookmark, Check } from 'lucide-react';

const BIBLE_URL = 'https://raw.githubusercontent.com/thiagobodruk/bible/refs/heads/master/json/en_bbe.json';

export default function BibleReader() {
  const [bibleData, setBibleData] = useState([]);
  const [currentBook, setCurrentBook] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [fontSize, setFontSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [bookmarkedAlert, setBookmarkedAlert] = useState('');

  useEffect(() => {
    async function fetchBible() {
      try {
        const response = await fetch(BIBLE_URL);
        const data = await response.json();
        setBibleData(data);
      } catch (error) {
        console.error("Failed to load Bible data:", error);
      }
    }
    fetchBible();
  }, []);

  const handleBookSelect = (index) => {
    setCurrentBook(index);
    setCurrentChapter(1);
  };

  const nextChapter = () => {
    const book = bibleData[currentBook];
    if (book && currentChapter < book.chapters.length) {
      setCurrentChapter(prev => prev + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(prev => prev - 1);
    }
  };

  const increaseFont = () => setFontSize(prev => Math.min(prev + 2, 40));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 2, 12));

  const copyVerse = (verse, index) => {
    const cleanVerse = verse.replace(/`/g, '');
    navigator.clipboard.writeText(cleanVerse);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 5000);
  };

  const bookmarkVerse = (ref, text) => {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    // Convert old string bookmarks to objects if necessary, or just check by ref
    const isBookmarked = bookmarks.some(b => (typeof b === 'string' ? b : b.ref) === ref);
    if (!isBookmarked) {
      bookmarks.push({ ref, text, date: new Date().toISOString() });
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    setBookmarkedAlert(`Bookmarked: ${ref}`);
    setTimeout(() => setBookmarkedAlert(''), 3000);
  };

  const filteredBooks = bibleData.map((book, index) => ({ ...book, originalIndex: index }))
    .filter(book => book.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (bibleData.length === 0) {
    return (
      <div className="layout">
        <main className="reader">
          <div className="reader-container">
            <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Holy Bible...</h1>
          </div>
        </main>
      </div>
    );
  }

  const activeBook = bibleData[currentBook];
  const activeChapterData = activeBook?.chapters[currentChapter - 1] || [];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Search Books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="book-list">
          {filteredBooks.map((book) => (
            <div
              key={book.originalIndex}
              className={`book-item ${currentBook === book.originalIndex ? 'active' : ''}`}
              onClick={() => handleBookSelect(book.originalIndex)}
            >
              {book.name}
            </div>
          ))}
        </div>
      </aside>

      <main className="reader">
        <div className="reader-container">
          <div className="reader-top">
            <h1>{activeBook?.name} {currentChapter}</h1>

            <div className="controls">
              <button onClick={prevChapter} disabled={currentChapter === 1}>
                <ChevronLeft size={18} /> Prev
              </button>
              <button onClick={nextChapter} disabled={currentChapter === activeBook?.chapters.length}>
                Next <ChevronRight size={18} />
              </button>
              <div style={{ width: '1px', background: 'var(--border)', margin: '0 8px' }}></div>
              <button onClick={increaseFont} title="Increase Font Size">
                <ZoomIn size={18} />
              </button>
              <button onClick={decreaseFont} title="Decrease Font Size">
                <ZoomOut size={18} />
              </button>
            </div>
          </div>

          {bookmarkedAlert && (
            <div style={{ padding: '12px 20px', background: 'var(--gold)', color: '#000', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>
              {bookmarkedAlert}
            </div>
          )}

          <div className="verses-container">
            {activeChapterData.map((verse, index) => (
              <div className="verse" key={index} style={{ fontSize: `${fontSize}px` }}>
                <span className="verse-number">{index + 1}</span>
                {verse}

                <div className="actions">
                  <button onClick={() => copyVerse(verse, index)}>
                    {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
                    {copiedIndex === index ? 'Copied' : 'Copy'}
                  </button>
                  <button onClick={() => bookmarkVerse(`${activeBook.name} ${currentChapter}:${index + 1}`, verse)}>
                    <Bookmark size={14} /> Bookmark
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
