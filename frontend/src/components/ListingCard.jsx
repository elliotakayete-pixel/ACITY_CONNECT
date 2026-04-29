import { Heart, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ListingCard({ listing, onInterested, busy }) {
  const { user } = useAuth();
  const isOwner = user?.id === listing.createdBy;
  const canInteract = user && !isOwner && listing.status === "Available";
  const canClick = !user || canInteract;

  return (
    <article className="listing-card">
      <div className="listing-card-header">
        <div>
          <p className="eyebrow">{listing.listingType}</p>
          <h3>{listing.title}</h3>
        </div>
        <span className={`status status-${listing.status.toLowerCase()}`}>{listing.status}</span>
      </div>

      <p>{listing.description}</p>

      <div className="meta-row">
        <span>{listing.category}</span>
        <span>By {listing.creatorName || "Student"}</span>
        {listing.approved && (
          <span className="approved">
            <ShieldCheck size={15} /> Approved
          </span>
        )}
      </div>

      <button
        className="button secondary"
        type="button"
        onClick={() => onInterested(listing)}
        disabled={!canClick || busy}
        title={isOwner ? "You own this listing" : "Express interest"}
      >
        <Heart size={17} /> Interested
      </button>
    </article>
  );
}
