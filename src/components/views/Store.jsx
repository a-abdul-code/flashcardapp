import "./Store.scss";
import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";

function Store() {
  //Initialisation ---------------------------------
  const { session } = useAuth();

  //State ------------------------------------------
  const [storeItems, setStoreItems] = useState([]);
  const [ownedItemIDs, setOwnedItemIDs] = useState([]);
  const [coinBalance, setCoinBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  //Handlers ---------------------------------------
  const fetchStoreData = async (userID) => {
    try {
      setLoading(true);

      const userFetch = await supabase.from("Users").select("coinBalance").eq("userID", userID).single();

      if (userFetch.error) throw userFetch.error;
      setCoinBalance(userFetch.data.coinBalance || 0);

      const itemsFetch = await supabase.from("Store_Items").select("*").order("itemPrice", { ascending: true });

      if (itemsFetch.error) throw itemsFetch.error;
      setStoreItems(itemsFetch.data);

      const ownedFetch = await supabase.from("Owned_Store_Item").select("itemID").eq("userID", userID);

      if (ownedFetch.error) throw ownedFetch.error;

      const ownedIDs = ownedFetch.data.map((record) => record.itemID);
      setOwnedItemIDs(ownedIDs);
    } catch (error) {
      console.error("Error fetching store data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (item) => {
    if (coinBalance < item.itemPrice) {
      alert(`Not enough Coins to Purchase ${item.itemName}.`);
      return;
    }

    const newBalance = coinBalance - item.itemPrice;
    const isCoinBoost = item.itemName === "2x Coin Boost (24h)";

    try {
      if (isCoinBoost) {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);

        const balanceUpdate = await supabase
          .from("Users")
          .update({
            coinBalance: newBalance,
            coinBoostExpireDate: expiryDate.toISOString(),
          })
          .eq("userID", session.user.id);

        if (balanceUpdate.error) throw balanceUpdate.error;
        alert("2x Coin Boost activated for 24 hours!");
      } else {
        const balanceUpdate = await supabase
          .from("Users")
          .update({ coinBalance: newBalance })
          .eq("userID", session.user.id);

        if (balanceUpdate.error) throw balanceUpdate.error;
      }

      if (!isCoinBoost) {
        const inventoryInsert = await supabase.from("Owned_Store_Item").insert({
          userID: session.user.id,
          itemID: item.itemID,
        });

        if (inventoryInsert.error) throw inventoryInsert.error;

        setOwnedItemIDs((prev) => [...prev, item.itemID]);
      }

      setCoinBalance(newBalance);
    } catch (error) {
      console.error("Error completing purchase:", error.message);
      alert("Failed to process purchase. Please try again.");
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchStoreData(session.user.id);
    }
  }, [session?.user?.id]);

  //View -------------------------------------------
  return loading ? (
    <p>Loading store...</p>
  ) : (
    <>
      <div className="header">
        <h1>Store</h1>
        <div className="pointsDisplay">
          <b>{coinBalance} points</b>
        </div>
      </div>

      <div className="storeItemsContainer">
        {storeItems.map((item) => {
          const isOwned = ownedItemIDs.includes(item.itemID);
          const notEnoughCoins = coinBalance < item.itemPrice;

          return (
            <div className="storeItemCard" key={item.itemID}>
              <div className="cardHeader">
                <p className="itemName">
                  <b>{item.itemName}</b>
                </p>
              </div>
              <p className="description">{item.description === "" ? "No Description Provided" : item.description}</p>

              <div className="itemFooter">
                <span className="price">{item.itemPrice} points</span>
              </div>

              <div className="buyContainer">
                <button className="navbutton" onClick={() => handlePurchase(item)} disabled={isOwned || notEnoughCoins}>
                  {isOwned ? "Already Owned" : notEnoughCoins ? "Not enough Coins to Purchase" : "Buy"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Store;
