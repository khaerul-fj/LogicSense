import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";

Blockly.Blocks["lompat_kanan"] = {
  init: function () {
    this.appendDummyInput().appendField("🐰 Lompat Kanan");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(40);
  },
};

javascriptGenerator.forBlock["lompat_kanan"] = function (block) {
  return 'move("right");\n';
};

function App() {
  const blocklyDiv = useRef();
  const [rabbitPos, setRabbitPos] = useState({ x: 0, y: 0 });
  const [status, setStatus] = useState("Bantu Kelinci cari Wortel!");
  const targetPos = { x: 3, y: 0 };

  useEffect(() => {
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: {
        kind: "flyoutToolbox",
        contents: [{ kind: "block", type: "lompat_kanan" }],
      },
      grid: { spacing: 20, length: 3, colour: "#ccc", snap: true },
      trashcan: true,
    });
    return () => workspace.dispose();
  }, []);

  const jalankanRencana = () => {
    const workspace = Blockly.getMainWorkspace();
    const code = javascriptGenerator.workspaceToCode(workspace);

    if (!code) {
      setStatus("Pasang bloknya dulu!");
      return;
    }

    let currentX = 0;
    const moves = code.split("\n").filter((m) => m.trim() !== "");

    setRabbitPos({ x: 0, y: 0 });
    setStatus("Kelinci lagi jalan...");

    moves.forEach((move, index) => {
      setTimeout(
        () => {
          if (move.includes("right")) {
            currentX += 1;
            setRabbitPos({ x: currentX, y: 0 });

            if (currentX === targetPos.x) {
              setStatus("🎉 NYAM! Kelinci kenyang!");
            } else if (currentX > targetPos.x) {
              setStatus("😅 Kelincinya kelebihan jalan!");
            }
          }
        },
        (index + 1) * 600,
      );
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#e0f7fa",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      <h1>🥕 LogicSense: Misi Kelinci</h1>

      <div
        style={{
          height: "150px",
          width: "500px",
          background: "#8bc34a",
          margin: "20px auto",
          borderRadius: "15px",
          position: "relative",
          border: "5px solid #558b2f",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: `${rabbitPos.x * 100 + 20}px`,
            fontSize: "50px",
            transition: "all 0.5s ease-in-out",
            zIndex: 2,
          }}
        >
          🐰
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: `${targetPos.x * 100 + 20}px`,
            fontSize: "50px",
          }}
        >
          🥕
        </div>
      </div>

      <p style={{ fontSize: "18px", fontWeight: "bold" }}>{status}</p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <div
          ref={blocklyDiv}
          style={{
            height: "350px",
            width: "500px",
            border: "3px solid #333",
            borderRadius: "15px",
            background: "#fff",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <button
            onClick={jalankanRencana}
            style={{
              padding: "20px 40px",
              fontSize: "20px",
              background: "#ff9800",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px #e68a00",
            }}
          >
            ▶ JALANKAN!
          </button>
          <button
            onClick={() => {
              setRabbitPos({ x: 0, y: 0 });
              setStatus("Bantu Kelinci cari Wortel!");
            }}
            style={{
              padding: "10px 20px",
              background: "#9e9e9e",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
