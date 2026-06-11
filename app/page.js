export default function Home() {
  return (
    <div style={{
      maxWidth: "500px",
      margin: "50px auto",
      padding: "20px",
      fontFamily: "sans-serif"
    }}>
      <h1>OGP短縮リンク作成</h1>

      <input
        placeholder="画像URL"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px"
        }}
      />

      <input
        placeholder="飛び先URL"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px"
        }}
      />

      <button
        style={{
          width: "100%",
          padding: "12px"
        }}
      >
        作成
      </button>
    </div>
  );
}
