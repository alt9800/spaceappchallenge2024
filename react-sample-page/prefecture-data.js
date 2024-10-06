const PrefectureDataPage = () => {
  const [cards, setCards] = React.useState([]);
  const prefectureName = "宮城県";

  React.useEffect(() => {
      // 実際のデータをここに追加します。この例ではダミーデータを使用しています。
      const dummyData = [
          {
              id: 1,
              photo: "https://picsum.photos/800?random=1",
              comment: "宮城県の沿岸部における津波後の復興状況を示す衛星画像です。緑地の回復と新たな都市計画の実施が確認できます。",
              username: "researcher1",
              photoDescription: "宮城県沿岸部の復興状況",
              dataLink: "https://example.com/data/miyagi/coastal"
          },
          {
              id: 2,
              photo: "https://picsum.photos/800?random=2",
              comment: "仙台市中心部の都市化進展を示す画像です。過去10年間で緑地面積が10%減少し、高層ビルが増加していることが分かります。",
              username: "urbanplanner",
              photoDescription: "仙台市中心部の都市化",
              dataLink: "https://example.com/data/miyagi/sendai-urban"
          },
          {
              id: 3,
              photo: "https://picsum.photos/800?random=3",
              comment: "宮城県南部の農地利用状況です。休耕地の増加が見られますが、一部地域では新たな作物導入による土地利用の変化も確認できます。",
              username: "agri-analyst",
              photoDescription: "宮城県南部の農地利用",
              dataLink: "https://example.com/data/miyagi/agriculture"
          }
      ];
      setCards(dummyData);
  }, []);

  return (
      <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{prefectureName}の衛星データ解析結果</h1>
              <button onClick={() => window.history.back()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  元のページに戻る
              </button>
          </div>
          <div className="space-y-4">
              {cards.map(card => (
                  <div key={card.id} className="border rounded-lg overflow-hidden shadow-lg">
                      <div className="p-4 flex">
                          <div className="relative w-1/3 mr-4">
                              <img 
                                  src={card.photo} 
                                  alt={`Satellite data for ${prefectureName}`}
                                  className="w-full h-auto object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 text-white p-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                  <p>{card.photoDescription}</p>
                                  <a href={card.dataLink} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
                                      元データを見る
                                  </a>
                              </div>
                          </div>
                          <div className="w-2/3">
                              <p className="mb-2">{card.comment}</p>
                              <p className="text-right text-sm text-gray-500">by {card.username}</p>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
};

ReactDOM.render(<PrefectureDataPage />, document.getElementById('root'));s