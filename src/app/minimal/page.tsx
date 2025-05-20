"use client";

export default function MinimalPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Minimal Test Page</h1>
      
      <div className="p-4 bg-blue-500 text-white rounded-lg mb-4">
        This is a blue box with white text.
      </div>
      
      <div className="p-4 bg-green-500 text-white rounded-lg mb-4">
        This is a green box with white text.
      </div>
      
      <div className="p-4 bg-red-500 text-white rounded-lg mb-4">
        This is a red box with white text.
      </div>
      
      <button 
        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700"
        onClick={() => alert('Button clicked!')}
      >
        Click Me
      </button>
    </div>
  );
}