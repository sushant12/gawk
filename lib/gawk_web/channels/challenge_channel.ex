defmodule GawkWeb.ChallengeChannel do
  use GawkWeb, :channel

  def join("challenge:" <> room_id, _payload, socket) do
    {:ok, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  # def handle_in("message", payload, socket) do
  #   broadcast!
  #   {:reply, {:ok, payload}, socket}
  # end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (challenge:lobby).

  def handle_in("peer-message", params, socket) do
    broadcast_from!(socket, "peer-message", params)
    {:noreply, socket}
  end
end
