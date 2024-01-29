import { useCallback, useEffect, useState } from "react";
import bingo from "./bingo.ts";
import API from "./api.ts";
import { getUIdFromDisplayName } from "osm-api";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

const PERIOD = [new Date(2023, 11, 1), new Date(2024, 11, 31)] as const;

function App() {
  const [username, setUsername] = useState("");

  const [confettiRun, setConfettiRun] = useState(false);
  const [confettiRecycle, setConfettiRecycle] = useState(true);

  const [results, setResults] = useState(bingo.map(() => false));
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const uid = await getUIdFromDisplayName(username);
      const api = new API(uid, PERIOD);
      const res = await Promise.all(bingo.map(({ check }) => check(api)));
      setResults(res);
      if (res.some((r) => r)) {
        setConfettiRecycle(true);
        setConfettiRun(true);
      }
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (confettiRun) {
      const timer = setTimeout(
        () => setConfettiRecycle(false),
        results.filter((r) => r).length * 1000,
      );
      return () => clearTimeout(timer);
    }
  }, [confettiRun, results]);

  const { width, height } = useWindowSize();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ marginBottom: 50 }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your OSM username"
          disabled={loading}
        />
        <button
          type="submit"
          onClick={load}
          disabled={loading || !username.trim()}
        >
          {loading ? "Loading..." : "Load your Bingo square"}
        </button>
      </div>
      <table style={{ borderCollapse: "collapse" }}>
        {[0, 1, 2].map((row) => (
          <tr key={row}>
            {bingo.slice(row * 3, (row + 1) * 3).map((b, idx) => (
              <td
                key={idx}
                style={{
                  ...(results[idx + row * 3]
                    ? { backgroundColor: "green" }
                    : {}),
                  fontStyle: b.implemented ? undefined : "italic",
                  width: 100,
                  padding: 10,
                  margin: 0,
                  border: "1px solid black",
                }}
              >
                {b.description}
              </td>
            ))}
          </tr>
        ))}
      </table>
      <ReactConfetti
        width={width}
        height={height}
        run={confettiRun}
        recycle={confettiRecycle}
      />
    </div>
  );
}

export default App;
