defmodule Gawk.Room do
  use Ecto.Schema
  import Ecto.Changeset

  schema "rooms" do
    field :name, :string

    timestamps()
  end

  @doc false
  def changeset(room, attrs) do
    room
    |> cast(attrs, [:name])
    |> validate_format(:name, ~r/^[a-zA-Z0-9]*$/)
    |> validate_required([:name])
  end
end
