import React, { useState } from 'react';
import { Check, Plus, Trash2, Mic, Wand2 } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Checklist = () => {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [AIQuery, setAIQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // 🎤 Voice Recognition
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Voice Recognition not supported');

    const recognition = new SpeechRecognition();
    recognition.lang = 'auto';
    recognition.start();

    recognition.onresult = (e) => {
      setAIQuery(e.results[0][0].transcript);
    };
  };

  // 🤖 AI Checklist Generator
const generateAI = async () => {
  if (!AIQuery.trim() || isGenerating) return;

  try {
    setIsGenerating(true);

    const res = await axios.post(
      "http://localhost:5000/api/ai/checklist-ai",
      { query: AIQuery }
    );

    const data = res.data;

    setLists(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: data.title,
        items: data.items.map((item) => {
          // If AI returns a string
          if (typeof item === "string") {
            return {
              id: crypto.randomUUID(),
              text: item,
              completed: false,
            };
          }
          // If AI returns an object
          return {
            id: crypto.randomUUID(),
            text: item.text ?? "",
            completed: item.completed ?? false,
          };
        }),
      },
    ]);

    setAIQuery("");
  } catch (err) {
    console.log("AI Checklist Error:", err);
  } finally {
    setIsGenerating(false);
  }
};


  // ⭐ Auto Essentials Filler
  const autoEssentials = (listId) => {
    const essentials = [
      'Passport',
      'Phone Charger',
      'Power Bank',
      'Toothbrush',
      'Underwear',
      'Socks',
      'Medicines',
      'Wallet / Cards',
    ];

    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: [
                ...list.items,
                ...essentials
                  .filter((e) => !list.items.some((i) => i.text === e))
                  .map((e) => ({
                    id: crypto.randomUUID(),
                    text: e,
                    completed: false,
                  })),
              ],
            }
          : list
      )
    );
  };

  // 📄 Export PDF
  const exportPDF = () => {
    const input = document.getElementById('checklist-area');
    html2canvas(input).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save('Checklist.pdf');
    });
  };

  const addList = () => {
    if (newListName.trim()) {
      setLists((prev) => [
        ...prev,
        { id: crypto.randomUUID(), name: newListName, items: [] },
      ]);
      setNewListName('');
    }
  };

  const deleteList = (listId) => {
    setLists((prev) => prev.filter((list) => list.id !== listId));
  };

  const addItem = (listId) => {
    if (newItemText.trim()) {
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: [
                  ...list.items,
                  {
                    id: crypto.randomUUID(),
                    text: newItemText,
                    completed: false,
                  },
                ],
              }
            : list
        )
      );
      setNewItemText('');
    }
  };

  const toggleItem = (listId, itemId) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId
                  ? { ...item, completed: !item.completed }
                  : item
              ),
            }
          : list
      )
    );
  };

  const deleteItem = (listId, itemId) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.filter((item) => item.id !== itemId),
            }
          : list
      )
    );
  };

  const getCompletion = (items) => {
    if (!items.length) return 0;
    let done = items.filter((i) => i.completed).length;
    return Math.round((done / items.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-6 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4" id="checklist-area">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1B1B1B]">
            Travel Smart Checklist
          </h1>
          <p className="text-[#767676]">Powered by GoTrip AI</p>
        </div>

        {/* AI Input */}
        <div className="bg-white p-4 rounded-xl shadow border mb-6">
          <h3 className="font-semibold text-lg text-[#222] mb-3 flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-[#1e599e]" />
            AI Checklist Generator
          </h3>

          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 rounded border"
              placeholder="e.g. Manali 5 days snow trip packing list"
              value={AIQuery}
              onChange={(e) => setAIQuery(e.target.value)}
            />

            <button
              onClick={startVoiceInput}
              className="px-4 bg-[#FF7A32] text-white rounded-lg flex items-center"
            >
              <Mic className="h-4 w-4" />
            </button>

            <button
              onClick={generateAI}
              disabled={isGenerating}
              className={`px-4 bg-[#1e599e] text-white rounded-lg font-medium ${
                isGenerating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Add Checklist */}
        <div className="bg-white rounded-xl p-4 shadow border mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="New Checklist Name"
              className="flex-1 px-3 py-2 border rounded-lg"
            />
            <button
              onClick={addList}
              className="bg-[#1e599e] text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>

        {/* Lists */}
        <div className="space-y-6">
          {lists.map((list) => (
            <div key={list.id} className="bg-white rounded-xl border shadow">
              {/* List Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h3 className="font-semibold text-lg">{list.name}</h3>
                  <p className="text-sm text-[#767676]">
                    {getCompletion(list.items)}% complete
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => autoEssentials(list.id)}
                    className="text-[#1664FF] font-medium text-sm"
                  >
                    Auto Essentials
                  </button>

                  <button
                    onClick={() => deleteList(list.id)}
                    className="text-[#1e599e]"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 space-y-3">
                {list.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded border"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleItem(list.id, item.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center ${
                          item.completed
                            ? 'bg-[#1e599e] text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {item.completed && <Check className="h-4 w-4" />}
                      </button>

                      <span
                        className={`text-sm ${
                          item.completed
                            ? 'line-through text-gray-500'
                            : ''
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteItem(list.id, item.id)}
                      className="text-[#1e599e]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Add Item */}
                <div className="flex gap-2 mt-3">
                  <input
                    className="flex-1 px-3 py-2 border rounded"
                    placeholder="Add new item..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                  />
                  <button
                    onClick={() => addItem(list.id)}
                    className="bg-[#0CA9A5] text-white p-2 rounded"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PDF Export Button */}
        <div className="text-center mt-8">
          <button
            onClick={exportPDF}
            className="px-6 py-3 bg-[#FF7A32] text-white rounded-lg font-medium hover:opacity-90"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checklist;
