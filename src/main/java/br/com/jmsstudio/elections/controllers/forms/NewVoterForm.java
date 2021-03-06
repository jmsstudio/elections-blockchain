package br.com.jmsstudio.elections.controllers.forms;

import javax.validation.constraints.NotNull;

import br.com.jmsstudio.elections.daos.EllectionDao;
import br.com.jmsstudio.elections.models.Voter;

public class NewVoterForm {

	@NotNull
	private Long number;
	@NotNull
	private Integer ellectionId;

	public Long getNumber() {
		return number;
	}

	public void setNumber(Long number) {
		this.number = number;
	}

	public Integer getEllectionId() {
		return ellectionId;
	}

	public void setEllectionId(Integer ellectionId) {
		this.ellectionId = ellectionId;
	}

	public Voter toVoter(EllectionDao ellectionDao) {
		return new Voter(number.toString(),ellectionDao.findById(ellectionId).get());
	}

}
