// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type Category struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Description *string `json:"description,omitempty"`
}

type NewCategory struct {
	Name        string  `json:"name"`
	Description *string `json:"description,omitempty"`
}
